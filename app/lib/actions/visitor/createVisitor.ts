'use server'

import { CreateVisitorInput } from '@/types/visitor'
import { auth } from '../../auth'
import { emailRegex } from '../../utils/regex'
import { buildLogMessage, getRequestContext } from '../../utils/parseUserAgent'
import { getActor } from '../user/getActor'
import prisma from '@/prisma/client'
import { chapterId } from '../../constants/api/chapterId'
import { createLog } from '../../utils/api/createLog'
import { resend } from '../../resend'
import { visitorInviteTemplate } from '../../email-templates/visitor.template'

export async function createVisitor(input: CreateVisitorInput): Promise<{
  success: boolean
  data?: { id: string }
  error?: string
}> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const { firstName, lastName, email, company, industry, phone, visitDate } = input

  if (!firstName || !lastName || !email) {
    return { success: false, error: 'Missing required fields' }
  }

  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email address' }
  }

  const [context, actor] = await Promise.all([
    getRequestContext().catch(() => null),
    getActor(session).catch(() => 'Unknown')
  ])

  try {
    const visitor = await prisma.visitor.create({
      data: {
        firstName,
        lastName,
        email,
        company,
        industry,
        phone: phone ?? null,
        visitDate: new Date(`${visitDate}T12:00:00`),
        chapterId,
        invitedById: session.user.id
      }
    })

    const start = new Date(`${visitDate}T00:00:00.000Z`)
    const end = new Date(`${visitDate}T23:59:59.999Z`)

    const visitorDay = await prisma.visitorDay
      .findFirst({
        where: {
          chapterId,
          date: { gte: start, lte: end }
        },
        select: { presenterName: true, presenterCompany: true }
      })
      .catch(() => null)

    function ordinal(n: number): string {
      const s = ['th', 'st', 'nd', 'rd']
      const v = n % 100
      return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
    }

    const d = new Date(`${visitDate}T12:00:00`)
    const dateLabel = `${d.toLocaleDateString('en-US', { month: 'long' })} ${ordinal(d.getDate())}, ${d.getFullYear()}`

    await resend.emails.send({
      from: 'Coastal Referral Exchange <noreply@coastal-referral-exchange.com>',
      to: email,
      bcc: session.user.email,
      subject: `You're invited to CORE on ${dateLabel}`,
      html: visitorInviteTemplate({
        visitorFirstName: firstName,
        invitedByName: actor,
        visitDate: dateLabel,
        presenterName: visitorDay?.presenterName,
        presenterCompany: visitorDay?.presenterCompany
      })
    })

    if (context) {
      const logMessage = await buildLogMessage(`added visitor ${firstName} ${lastName} (${email})`, actor, context)
      await createLog('info', logMessage, {
        action: 'CREATE_VISITOR',
        entityId: visitor.id,
        userId: session.user.id,
        chapterId
      }).catch(() => null)
    }

    return { success: true }
  } catch (err) {
    if (context) {
      const logMessage = await buildLogMessage(
        `failed to add visitor ${firstName} ${lastName} (${company})`,
        actor,
        context
      ).catch(() => `${actor} failed to add visitor ${firstName} ${lastName}`)
      await createLog('error', logMessage, {
        action: 'CREATE_VISITOR',
        userId: session.user.id,
        chapterId
      }).catch(() => null)
    }

    return { success: false, error: 'Failed to add visitor. Please try again.' }
  }
}
