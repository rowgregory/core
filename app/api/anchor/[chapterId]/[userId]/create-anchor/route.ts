import { sliceAnchor } from '@/app/lib/constants/api/sliceNames'
import { createLog } from '@/app/lib/utils/api/createLog'
import { getUserFromHeader } from '@/app/lib/utils/api/getUserFromheader'
import { handleApiError } from '@/app/lib/utils/api/handleApiError'
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

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
    const {
      businessValue,
      clientName,
      closedDate,
      description,
      notes,
      receiverId,
      giverId,
      status,
      // External attributes
      externalGiverName,
      externalGiverEmail,
      externalGiverCompany,
      externalReceiverName,
      externalReceiverEmail,
      externalReceiverCompany
    } = body

    const isFleetEarnings = giverId === 'fleet-earnings'

    // Validation: ensure at least one participant is internal
    if (!isFleetEarnings && !giverId && !receiverId) {
      return NextResponse.json(
        { message: 'At least one participant (giver or receiver) must be a registered user' },
        { status: 400 }
      )
    }

    // Prevent self-referral (only applies to internal users)
    if (!isFleetEarnings && giverId && receiverId && giverId === receiverId) {
      return NextResponse.json({ message: 'Cannot drop anchor for yourself' }, { status: 400 })
    }

    // Validate internal giver if provided
    let giver = null
    if (!isFleetEarnings && giverId) {
      giver = await prisma.user.findFirst({
        where: {
          id: giverId,
          chapterId: chapterId
        }
      })

      if (!giver) {
        return NextResponse.json({ message: 'Giver not found or not in the same chapter' }, { status: 404 })
      }
    }

    // Validate internal receiver if provided
    let receiver = null
    if (receiverId) {
      receiver = await prisma.user.findFirst({
        where: {
          id: receiverId,
          chapterId: chapterId
        }
      })

      if (!receiver) {
        return NextResponse.json({ message: 'Receiver not found or not in the same chapter' }, { status: 404 })
      }
    }

    // Validate external participant data
    if (!isFleetEarnings && !giverId && !externalGiverName?.trim()) {
      return NextResponse.json(
        { message: 'External giver name is required when no internal giver is selected' },
        { status: 400 }
      )
    }

    if (!receiverId && !externalReceiverName?.trim()) {
      return NextResponse.json(
        { message: 'External receiver name is required when no internal receiver is selected' },
        { status: 400 }
      )
    }

    const anchor = await prisma.anchor.create({
      data: {
        businessValue,
        clientName,
        closedDate,
        description,
        notes,
        chapterId,
        giverId: isFleetEarnings ? null : giverId || null,
        receiverId: receiverId || null,
        status,
        // External giver fields
        externalGiverName: isFleetEarnings ? 'Fleet Earnings' : !giverId ? externalGiverName?.trim() : null,
        externalGiverEmail: isFleetEarnings ? null : !giverId ? externalGiverEmail?.trim() : null,
        externalGiverCompany: isFleetEarnings ? 'Chapter Revenue' : !giverId ? externalGiverCompany?.trim() : null,
        // External receiver fields (only when no internal receiver)
        externalReceiverName: !receiverId ? externalReceiverName?.trim() : null,
        externalReceiverEmail: !receiverId ? externalReceiverEmail?.trim() : null,
        externalReceiverCompany: !receiverId ? externalReceiverCompany?.trim() : null
      },
      include: {
        ...(!isFleetEarnings &&
          giverId && {
            giver: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }),
        ...(receiverId && {
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }),
        chapter: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Send emails (only for internal users)
    if (status === 'REPORTED') {
      if (giverId && receiverId) {
        // Both internal - send notification to receiver
      } else if (giverId) {
        // Internal giver, external receiver - could send admin notification
        // notificationFactory.anchor.externalReceiver(giver.name, chapterId, anchor.id, giverId)
      } else if (receiverId) {
        // External giver, internal receiver - notify the receiver
      }
    }

    await createLog('info', 'New anchor created', {
      location: ['app route - POST /api/anchor/[chapterId]/create-anchor'],
      message: `New anchor created with ${giverId ? 'internal' : 'external'} giver and ${receiverId ? 'internal' : 'external'} receiver`,
      name: 'AnchorCreated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      anchorId: anchor.id,
      hasExternalParticipant: !giverId || !receiverId
    })

    return NextResponse.json(
      {
        anchor,
        message: 'Anchor created successfully',
        sliceName: sliceAnchor
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError({ error, req, action: 'create anchor', sliceName: sliceAnchor })
  }
}
