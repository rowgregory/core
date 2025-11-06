import { sliceParley } from '@/app/lib/constants/api/sliceNames'
import parleyRequestTemplate from '@/app/lib/email-templates/parley-request'
import { createLog } from '@/app/lib/utils/api/createLog'
import { getUserFromHeader } from '@/app/lib/utils/api/getUserFromheader'
import { handleApiError } from '@/app/lib/utils/api/handleApiError'
import { formatDate } from '@/app/lib/utils/date/formatDate'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest, { params }: any) {
  try {
    const userAuth = getUserFromHeader({ req })

    if (!userAuth.success) {
      return userAuth.response!
    }

    const parameters = await params
    const chapterId = parameters.chapterId

    if (!chapterId) {
      return NextResponse.json({ message: 'Missing chapter Id' }, { status: 400 })
    }

    // Parse request body
    const body = await req.json()
    const { recipientId, status, scheduledAt, duration = 30, location, meetingType = 'DECK_TO_DECK', notes } = body

    const requesterId = userAuth.user.id

    // Prevent self-meeting
    if (requesterId === recipientId) {
      return NextResponse.json({ message: 'Cannot schedule a meeting with yourself' }, { status: 400 })
    }

    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledAt)

    // Check if recipient exists and is in the same chapter
    const recipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
        chapterId: chapterId
      }
    })

    if (!recipient) {
      await createLog('warn', 'Parley creation failed: Recipient not found', {
        requesterId,
        recipientId,
        chapterId
      })
      return NextResponse.json(
        {
          message: 'Recipient not found or not in the same chapter'
        },
        { status: 404 }
      )
    }

    // Check for existing meeting at the same time
    const existingMeeting = await prisma.parley.findFirst({
      where: {
        OR: [
          {
            requesterId: requesterId,
            scheduledAt: scheduledDate
          },
          {
            recipientId: requesterId,
            scheduledAt: scheduledDate
          },
          {
            requesterId: recipientId,
            scheduledAt: scheduledDate
          },
          {
            recipientId: recipientId,
            scheduledAt: scheduledDate
          }
        ],
        status: {
          in: ['REQUESTED', 'CONFIRMED']
        }
      }
    })

    if (existingMeeting) {
      // Determine who has the conflict
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

      return NextResponse.json(
        {
          message: `${conflictUser} already ${conflictUser === 'You' ? 'have' : 'has'} a parley scheduled at ${new Date(scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}${conflictWith ? ` with ${conflictWith.name}` : ''}. Please choose a different time.`
        },
        { status: 409 }
      )
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
      return NextResponse.json(
        {
          message: 'A parley between you and this crew member at this time already exists',
          parleyId: duplicateParley.id
        },
        { status: 409 }
      )
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

    const meetingTypes = [
      { value: 'DECK_TO_DECK', description: 'In-person meeting' },
      { value: 'VOYAGE_CALL', description: 'Video call (Zoom, Teams, etc.)' },
      { value: 'MESSAGE_IN_A_BOTTLE', description: 'Audio-only conversation' },
      { value: 'LANTERN_LIGHT', description: 'Text-based parley (SMS, chat)' }
    ]

    const formatEnumToReadable = (enumString: string): string => {
      if (!enumString) return ''

      // Find the meeting type that matches the enum
      const meetingType = meetingTypes.find((type) => type.value === enumString)

      // Format the enum string to readable format
      const formattedLabel = enumString
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

      // Return formatted label with description if found, otherwise just the formatted label
      return meetingType ? `${formattedLabel} - ${meetingType.description}` : formattedLabel
    }

    const nodeEnv = process.env.NODE_ENV

    const baseUrl = nodeEnv === 'development' ? 'http://localhost:3000' : 'https://coastal-referral-exchange.com'
    const bridgePath = userAuth.user.isAdmin ? '/admin/parley' : '/member/parley'
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
      location: ['app route - POST /api/parley/[chapterId]/create'],
      message: `New parley request`,
      name: 'ParleyRequested',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json(
      {
        parley,
        message: 'Parley request created successfully',
        sliceName: sliceParley
      },
      { status: 201 }
    )
  } catch (error) {
    return await handleApiError({ error, req, action: 'create parley', sliceName: sliceParley })
  }
}
