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

  if (!existingUser) {
    await createLog('info', `Google sign-in attempted — no account found for ${user.email}`, {
      location: 'handleGoogleCallback',
      timestamp: new Date().toISOString(),
      email: user.email
    })
    return false
  }

  if (existingUser.membershipStatus === 'PENDING' || existingUser.membershipStatus === 'CANCELLED') {
    await createLog(
      'warning',
      `Google sign-in blocked — membership is ${existingUser.membershipStatus}: ${user.email}`,
      {
        location: 'handleGoogleCallback',
        timestamp: new Date().toISOString(),
        email: user.email,
        membershipStatus: existingUser.membershipStatus
      }
    )
    return false
  }

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

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { lastLoginAt: new Date(), emailVerified: new Date() }
  })

  user.id = existingUser.id

  await createLog('info', `${existingUser.name} signed in with Google`, {
    location: 'handleGoogleCallback',
    timestamp: new Date().toISOString(),
    email: user.email,
    userId: existingUser.id
  })

  return true
}
