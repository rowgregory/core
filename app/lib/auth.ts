import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { createLog } from './utils/api/createLog'
import magicLinkTemplate from './email-templates/magic-link'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: false,
  session: {
    strategy: 'jwt', // JWT only - no database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    error: '/auth/login'
  },

  providers: [
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      maxAge: 60 * 60, // 60 mins
      from: process.env.RESEND_FROM_EMAIL!,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        try {
          const result = await resend.emails.send({
            from: `Navigator Access <${provider.from!}>`,
            to: email,
            subject: 'Your Bridge Awaits — Click to Enter, Navigator',
            html: magicLinkTemplate(url)
          })

          await createLog('info', 'Success magic link set', {
            location: ['auth.ts - session callback - info'],
            name: 'SessionbackError',
            timestamp: new Date().toISOString(),
            email,
            result
          })
        } catch (error) {
          await createLog('warning', 'Failed to send verification email', {
            location: ['auth.ts - send verification request'],
            name: 'FailedToSendMagicLink',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          throw error
        }
      }
    }
  ],
  callbacks: {
    async signIn({ user, account, email: emailData }) {
      // If this is just the initial email sending request, allow it
      if (emailData?.verificationRequest) {
        return true
      }

      // This is the actual sign-in attempt (user clicked the magic link)
      if (account?.provider === 'email') {
        try {
          // Check if user exists in database
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          // If user doesn't exist, reject sign-in (BNI members must be pre-created)
          if (!dbUser) {
            await createLog('warning', 'Sign-in attempt by non-member', {
              location: ['auth.ts - signIn callback - user not found'],
              name: 'NonMemberSignInAttempt',
              timestamp: new Date().toISOString(),
              email: user.email
            })
            return false
          }

          // Check if user is active (optional business rule)
          if (dbUser.membershipStatus !== 'ACTIVE') {
            await createLog('warning', 'Sign-in attempt by inactive member', {
              location: ['auth.ts - signIn callback'],
              name: 'InactiveMemberSignInAttempt',
              userId: dbUser.id,
              email: user.email,
              membershipStatus: dbUser.membershipStatus,
              timestamp: new Date().toISOString()
            })
            return false
          }

          // Update user's last login
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              lastLoginAt: new Date(),
              emailVerified: new Date()
            }
          })

          await createLog('info', 'Successful user sign-in', {
            location: ['auth.ts - signIn callback - success'],
            name: 'UserSignInSuccess',
            timestamp: new Date().toISOString(),
            userId: dbUser.id,
            email: user.email
          })

          return true
        } catch (error) {
          await createLog('error', 'Sign-in callback error', {
            location: ['auth.ts - signIn callback - error'],
            name: 'SignInCallbackError',
            timestamp: new Date().toISOString(),
            email: user.email,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          return false
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // First time sign in - get user from database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (dbUser) {
            // Store only userId in JWT
            token.userId = dbUser.id
            token.role = dbUser.role
            token.isAdmin = dbUser.isAdmin
            token.isSuperUser = dbUser.isSuperUser
            token.isMembership = dbUser.isMembership
          }
        } catch (error) {
          await createLog('error', 'Sign-in callback error', {
            location: ['auth.ts - jwt callback - error'],
            name: 'JWTbackError',
            timestamp: new Date().toISOString(),
            email: user.email,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
      return token
    },
    async session({ session, token }) {
      // Transfer data from token to session
      if (token.userId && typeof token.userId === 'string') {
        session.user.id = token.userId
        session.user.role = token.role as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.isSuperUser = token.isSuperUser as boolean
        session.user.isMembership = token.isMembership as boolean
      } else {
        await createLog('error', 'Sign-in callback error', {
          location: ['auth.ts - session callback - error'],
          name: 'SessionbackError',
          timestamp: new Date().toISOString(),
          email: session.user.email,
          error: 'Session callback error - missing userId in token'
        })
      }

      return session
    }
  }
})
