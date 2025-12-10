import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { handleApiError } from '@/app/lib/utils/api/handleApiError'
import { sliceUser } from '@/app/lib/constants/api/sliceNames'
import { createLog } from '@/app/lib/utils/api/createLog'

export async function PUT(req: NextRequest, { params }: any) {
  try {
    const parameters = await params
    const chapterId = parameters.chapterId
    const userId = parameters.userId

    const body = await req.json()
    const {
      name,
      email,
      phone,
      company,
      industry,
      membershipStatus,
      joinedAt,
      expiresAt,
      isAdmin,
      isMembership,
      isPublic,
      rejectionReason
    } = body

    // Check if user exists and user has permission to update
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        chapterId: chapterId
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          error: 'User not found or you do not have permission to update this profile'
        },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      name: name?.trim(),
      email: email?.trim(),
      phone,
      company: company?.trim(),
      industry: industry?.trim(),
      membershipStatus,
      joinedAt,
      expiresAt,
      isAdmin,
      isMembership,
      isPublic,
      role: isAdmin ? 'ADMIN' : 'MEMBER',
      ...(rejectionReason && { rejectionReason })
    }

    // Update the user
    const updatedUser = await prisma.user.update({ where: { id: userId }, data: updateData })

    await createLog('info', 'User updated by admin', {
      location: ['app route - GET /api/user/[chapterId]/[userId]/update-user'],
      message: `User updated by admin`,
      name: 'UserUpdatedByAdmin',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json(
      {
        user: updatedUser,
        succes: true,
        message: 'Navigator updated'
      },
      { status: 200 }
    )
  } catch (error) {
    return await handleApiError({
      error,
      req,
      action: 'Admin update user profile',
      sliceName: sliceUser
    })
  }
}
