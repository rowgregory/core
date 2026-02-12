'use server'

import { revalidateTag } from 'next/cache'
import { Resend } from 'resend'
import { auth } from '../auth'
import prisma from '@/prisma/client'
import { chapterId } from '../constants/api/chapterId'
import { createLog } from '../utils/api/createLog'
import parleyRequestTemplate from '../email-templates/parley-request'
import { formatDate } from '../utils/date/formatDate'

const resend = new Resend(process.env.RESEND_API_KEY)

const meetingTypes = [
  { value: 'DECK_TO_DECK', description: 'In-person meeting' },
  { value: 'VOYAGE_CALL', description: 'Video call (Zoom, Teams, etc.)' },
  { value: 'MESSAGE_IN_A_BOTTLE', description: 'Audio-only conversation' },
  { value: 'LANTERN_LIGHT', description: 'Text-based parley (SMS, chat)' }
]

const formatEnumToReadable = (enumString: string): string => {
  if (!enumString) return ''

  const meetingType = meetingTypes.find((type) => type.value === enumString)

  const formattedLabel = enumString
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return meetingType ? `${formattedLabel} - ${meetingType.description}` : formattedLabel
}

export async function createParley(data: {
  recipientId: string
  status: string
  scheduledAt: Date
  duration?: number
  location?: string
  meetingType?: string
  notes?: string
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const requesterId = session.user.id
    const { recipientId, status, scheduledAt, duration = 30, location, meetingType = 'DECK_TO_DECK', notes } = data

    // Prevent self-meeting
    if (requesterId === recipientId) {
      return {
        success: false,
        error: 'Cannot schedule a meeting with yourself'
      }
    }

    const scheduledDate = new Date(scheduledAt)

    // Check if recipient exists and is in the same chapter
    const recipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
        chapterId
      }
    })

    if (!recipient) {
      await createLog('warn', 'Parley creation failed: Recipient not found', {
        requesterId,
        recipientId,
        chapterId
      })
      return {
        success: false,
        error: 'Recipient not found or not in the same chapter'
      }
    }

    // Check for existing meeting at the same time
    const existingMeeting = await prisma.parley.findFirst({
      where: {
        OR: [
          { requesterId: requesterId, scheduledAt: scheduledDate },
          { recipientId: requesterId, scheduledAt: scheduledDate },
          { requesterId: recipientId, scheduledAt: scheduledDate },
          { recipientId: recipientId, scheduledAt: scheduledDate }
        ],
        status: {
          in: ['REQUESTED', 'CONFIRMED']
        }
      }
    })

    if (existingMeeting) {
      const conflictUser =
        existingMeeting.requesterId === requesterId || existingMeeting.recipientId === requesterId
          ? 'You'
          : recipient.name || 'The other crew member'

      const conflictWith =
        existingMeeting.requesterId === requesterId
          ? await prisma.user.findUnique({
              where: { id: existingMeeting.recipientId },
              select: { name: true }
            })
          : await prisma.user.findUnique({
              where: { id: existingMeeting.requesterId },
              select: { name: true }
            })

      await createLog('warn', 'Parley creation failed: Time conflict', {
        requesterId,
        recipientId,
        scheduledAt,
        existingMeetingId: existingMeeting.id
      })

      return {
        success: false,
        error: `${conflictUser} already ${conflictUser === 'You' ? 'have' : 'has'} a parley scheduled at ${new Date(scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}${conflictWith ? ` with ${conflictWith.name}` : ''}. Please choose a different time.`
      }
    }

    // Check for exact duplicate parley
    const duplicateParley = await prisma.parley.findUnique({
      where: {
        requesterId_recipientId_scheduledAt: {
          requesterId: requesterId,
          recipientId: recipientId,
          scheduledAt: scheduledDate
        }
      }
    })

    if (duplicateParley) {
      await createLog('warn', 'Parley creation failed: Duplicate parley', {
        requesterId,
        recipientId,
        scheduledAt,
        existingParleyId: duplicateParley.id
      })
      return {
        success: false,
        error: 'A parley between you and this crew member at this time already exists',
        parleyId: duplicateParley.id
      }
    }

    // Create the Parley meeting
    const parley = await prisma.parley.create({
      data: {
        requesterId,
        recipientId,
        scheduledAt: scheduledDate,
        duration,
        location,
        meetingType,
        notes,
        chapterId,
        status,
        completed: status === 'COMPLETED' ? true : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileImage: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileImage: true
          }
        },
        chapter: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const nodeEnv = process.env.NODE_ENV
    const baseUrl = nodeEnv === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'
    const bridgePath = session.user.isAdmin ? '/admin/parley' : '/member/parley'
    const fullUrl = `${baseUrl}${bridgePath}`

    const parleyRequestHtmlString = parleyRequestTemplate(
      parley.requester.name,
      formatEnumToReadable(parley.meetingType),
      formatDate(parley.scheduledAt, { includeTime: true }),
      fullUrl,
      parley.duration,
      parley.location ? `at ${parley.location}` : 'aboard the bridge'
    )

    await resend.emails.send({
      from: `${parley.completed ? 'Parley Submitted' : 'Parley Request'} <no-reply@coastal-referral-exchange.com>`,
      to: [parley.recipient.email],
      subject: `Parley ${parley.completed ? 'Submitted' : 'Request'} from ${parley.requester.name === 'Gregory Row' ? 'Sqysh' : parley.requester.name} ${!parley.completed && '- Respond Now!'}`,
      html: parleyRequestHtmlString
    })

    await createLog('info', `New parley ${parley.completed ? 'submitted' : 'request'}`, {
      location: ['server action - createParley'],
      message: `New parley request`,
      name: 'ParleyRequested',
      timestamp: new Date().toISOString()
    })

    revalidateTag('Parley', 'default')

    return {
      success: true,
      message: 'Parley request created successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to create parley', {
      location: ['server action - createParley'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'CreateParleyError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to create parley'
    }
  }
}
