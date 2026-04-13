import { User as NextAuthUser, Account } from 'next-auth'
import prisma from '@/prisma/client'
import { createLog } from '../utils/api/createLog'

export async function handleGoogleCallback(user: NextAuthUser, account: Account): Promise<boolean> {
  if (!user.email) return false

  // Check primary then secondary email
  let existingUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true, name: true, membershipStatus: true }
  })

  if (!existingUser) {
    existingUser = await prisma.user.findFirst({
      where: { secondaryEmail: user.email },
      select: { id: true, name: true, membershipStatus: true }
    })
  }

  // ── No account — log interest and block ──
  if (!existingUser) {
    await createLog('info', `Google sign-in attempted — no account found for ${user.email}`, {
      location: ['googleProvider.ts - handleGoogleCallback'],
      name: 'GoogleSignInInterested',
      timestamp: new Date().toISOString(),
      email: user.email
    })
    return false
  }

  // ── Has account but not active — block ──
  if (existingUser.membershipStatus !== 'ACTIVE') {
    await createLog(
      'warning',
      `Google sign-in blocked — membership is ${existingUser.membershipStatus}: ${user.email}`,
      {
        location: ['googleProvider.ts - handleGoogleCallback'],
        name: 'GoogleSignInBlockedInactiveMember',
        timestamp: new Date().toISOString(),
        email: user.email,
        membershipStatus: existingUser.membershipStatus
      }
    )
    return false
  }

  // ── Active member — link account if needed ──
  const existingAccount = await prisma.account.findFirst({
    where: { userId: existingUser.id, provider: 'google' }
  })

  if (!existingAccount) {
    await prisma.account.create({
      data: {
        userId: existingUser.id,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        access_token: account.access_token,
        expires_at: account.expires_at,
        id_token: account.id_token,
        refresh_token: account.refresh_token,
        scope: account.scope,
        token_type: account.token_type
      }
    })
  }

  // Update last login
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { lastLoginAt: new Date(), emailVerified: new Date() }
  })

  user.id = existingUser.id

  await createLog('info', `${existingUser.name} signed in with Google`, {
    location: ['googleProvider.ts - handleGoogleCallback'],
    name: 'GoogleSignInSuccess',
    timestamp: new Date().toISOString(),
    email: user.email,
    userId: existingUser.id
  })

  return true
}
