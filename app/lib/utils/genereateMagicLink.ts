import prisma from '@/prisma/client'
import { randomBytes } from 'crypto'

export async function generateMagicLink(email: string, baseUrl: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  })

  const params = new URLSearchParams({
    callbackUrl: `${baseUrl}/dashboard`,
    token,
    email
  })

  return `${baseUrl}/api/auth/callback/email?${params.toString()}`
}
