'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/lib/utils/api/createLog'
import { auth } from '@/app/lib/auth'
import { chapterId } from '@/app/lib/constants/api/chapterId'

export async function updateMyProfile(data: {
  name?: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  website?: string
  title?: string
  businessLicenseNumber?: string
  yearsInBusiness?: number
  bio?: string
  role?: string
  interests?: string
  profileImage?: string
  profileImageFilename?: string
  isPublic?: boolean
  isActive?: boolean
  membershipStatus?: string
  isLicensed?: boolean

  // Professional Goals & Media
  goal?: string
  collage?: string
  coverImage?: string
  coverImageFilename?: string

  // Social Media & Online Presence
  facebookUrl?: string
  threadsUrl?: string
  youtubeUrl?: string
  xUrl?: string
  linkedInUrl?: string
  portfolioUrl?: string

  // Content & Communication
  posts?: string
  podcasts?: string

  // Skills & Professional Development
  skills?: string
  careerAchievements?: string
  learningGoals?: string

  // Services & Professional Network
  servicesOffered?: string
  professionalAssociations?: string
  professionalBooks?: string

  // Projects & Expertise Sharing
  sideProjects?: string
  askMeAbout?: string
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const userId = session.user.id

    // Verify user exists in the chapter
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        chapterId: chapterId
      }
    })

    if (!existingUser) {
      return {
        success: false,
        error: 'User not found in this chapter'
      }
    }

    // Build update data object, only including provided fields
    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.company !== undefined) updateData.company = data.company
    if (data.industry !== undefined) updateData.industry = data.industry
    if (data.website !== undefined) updateData.website = data.website
    if (data.title !== undefined) updateData.title = data.title
    if (data.businessLicenseNumber !== undefined) updateData.businessLicenseNumber = data.businessLicenseNumber
    if (data.yearsInBusiness !== undefined) updateData.yearsInBusiness = data.yearsInBusiness
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.role !== undefined) updateData.role = data.role
    if (data.interests !== undefined) updateData.interests = data.interests
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage
    if (data.profileImageFilename !== undefined) updateData.profileImageFilename = data.profileImageFilename
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.membershipStatus !== undefined) updateData.membershipStatus = data.membershipStatus
    if (data.isLicensed !== undefined) updateData.isLicensed = data.isLicensed

    // Professional Goals & Media
    if (data.goal !== undefined) updateData.goal = data.goal
    if (data.collage !== undefined) updateData.collage = data.collage
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage
    if (data.coverImageFilename !== undefined) updateData.coverImageFilename = data.coverImageFilename

    // Social Media & Online Presence
    if (data.facebookUrl !== undefined) updateData.facebookUrl = data.facebookUrl
    if (data.threadsUrl !== undefined) updateData.threadsUrl = data.threadsUrl
    if (data.youtubeUrl !== undefined) updateData.youtubeUrl = data.youtubeUrl
    if (data.xUrl !== undefined) updateData.xUrl = data.xUrl
    if (data.linkedInUrl !== undefined) updateData.linkedInUrl = data.linkedInUrl
    if (data.portfolioUrl !== undefined) updateData.portfolioUrl = data.portfolioUrl

    // Content & Communication
    if (data.posts !== undefined) updateData.posts = data.posts
    if (data.podcasts !== undefined) updateData.podcasts = data.podcasts

    // Skills & Professional Development
    if (data.skills !== undefined) updateData.skills = data.skills
    if (data.careerAchievements !== undefined) updateData.careerAchievements = data.careerAchievements
    if (data.learningGoals !== undefined) updateData.learningGoals = data.learningGoals

    // Services & Professional Network
    if (data.servicesOffered !== undefined) updateData.servicesOffered = data.servicesOffered
    if (data.professionalAssociations !== undefined) updateData.professionalAssociations = data.professionalAssociations
    if (data.professionalBooks !== undefined) updateData.professionalBooks = data.professionalBooks

    // Projects & Expertise Sharing
    if (data.sideProjects !== undefined) updateData.sideProjects = data.sideProjects
    if (data.askMeAbout !== undefined) updateData.askMeAbout = data.askMeAbout

    // Update the user profile
    await prisma.user.update({
      where: {
        id: userId
      },
      data: updateData
    })

    await createLog('info', 'User profile updated', {
      location: ['server action - updateMyProfile'],
      message: `User ${userId} updated their profile`,
      name: 'UserProfileUpdated',
      timestamp: new Date().toISOString(),
      userId
    })

    revalidateTag('User', 'default')

    return {
      success: true,
      message: 'Profile updated successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to update user profile', {
      location: ['server action - updateMyProfile'],
      message: error instanceof Error ? error.message : 'Unknown error',
      name: 'UpdateMyProfileError',
      timestamp: new Date().toISOString(),
      error
    })

    return {
      success: false,
      error: 'Failed to update profile'
    }
  }
}
