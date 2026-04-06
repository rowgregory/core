import prisma from '@/prisma/client'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const members = await prisma.user.findMany({
    where: {
      membershipStatus: 'ACTIVE'
    },
    select: {
      name: true,
      email: true
    }
  })

  const results = await Promise.allSettled(
    members.map((member) =>
      resend.emails.send({
        from: 'Coastal Referral Exchange <no-reply@coastal-referral-exchange.com>',
        to: member.email,
        subject: 'CORE Member Directory — Latest Roster',
        html: memberDirectoryTemplate(member.name.split(' ')[0])
      })
    )
  )

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return NextResponse.json({ succeeded, failed })
}
