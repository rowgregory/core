import { NextRequest, NextResponse } from 'next/server'
import { createLog } from '@/app/lib/utils/api/createLog'
import { handleApiError } from '@/app/lib/utils/api/handleApiError'
import { sliceUser } from '@/app/lib/constants/api/sliceNames' // Adjust import path
import prisma from '@/prisma/client'

export async function updateMyProfile(req: NextRequest, chapterId: string, userId: string) {
  try {
    // Validate parameters
    if (!chapterId || !userId) {
      return NextResponse.json(
        {
          error: 'Chapter ID and User ID are required'
        },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await req.json()
    const {
      name,
      phone,
      company,
      industry,
      interests,
      isPublic,
      isAdmin,
      isMembership,
      profileImage,
      profileImageFilename,
      bio,
      yearsInBusiness,
      website,
      businessLicenseNumber,
      title,
      // NEW: Professional Goals & Media
      goal,
      collage,
      coverImage,
      coverImageFilename,
      // NEW: Social Media & Online Presence
      facebookUrl,
      threadsUrl,
      youtubeUrl,
      xUrl,
      linkedInUrl,
      portfolioUrl,
      // NEW: Content & Communication
      posts,
      podcasts,
      // NEW: Skills & Professional Development
      skills,
      careerAchievements,
      learningGoals,
      // NEW: Services & Professional Network
      servicesOffered,
      professionalAssociations,
      professionalBooks,
      // NEW: Projects & Expertise Sharing
      sideProjects,
      askMeAbout,
      weeklyTreasureWishlist
    } = body

    // Validate required fields
    if (!name || !company || !industry) {
      return NextResponse.json(
        {
          error: 'Required fields: name, company, industry',
          sliceName: sliceUser
        },
        { status: 400 }
      )
    }

    // Check if user exists and user has permission to update
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        chapterId: chapterId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        industry: true,
        interests: true,
        isPublic: true,
        isActive: true,
        profileImage: true,
        profileImageFilename: true,
        title: true,
        // Add new fields to select
        goal: true,
        collage: true,
        coverImage: true,
        coverImageFilename: true,
        facebookUrl: true,
        threadsUrl: true,
        youtubeUrl: true,
        xUrl: true,
        linkedInUrl: true,
        portfolioUrl: true,
        posts: true,
        podcasts: true,
        skills: true,
        careerAchievements: true,
        learningGoals: true,
        servicesOffered: true,
        professionalAssociations: true,
        professionalBooks: true,
        sideProjects: true,
        askMeAbout: true,
        updatedAt: true,
        weeklyTreasureWishlist: true
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
      name: name.trim(),
      company: company.trim(),
      industry: industry.trim()
    }

    // Add optional fields if provided
    if (phone !== undefined) updateData.phone = phone?.trim() || null
    if (interests !== undefined) updateData.interests = interests
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic)
    if (isAdmin !== undefined) updateData.isAdmin = Boolean(isAdmin)
    if (isMembership !== undefined) updateData.isMembership = Boolean(isMembership)
    if (profileImage !== undefined) updateData.profileImage = profileImage
    if (profileImageFilename !== undefined) updateData.profileImageFilename = profileImageFilename
    if (bio !== undefined) updateData.bio = bio
    if (website !== undefined) updateData.website = website
    if (yearsInBusiness !== undefined) updateData.yearsInBusiness = yearsInBusiness
    if (businessLicenseNumber !== undefined) updateData.businessLicenseNumber = businessLicenseNumber
    if (title !== undefined) updateData.title = title

    // NEW: Professional Goals & Media
    if (goal !== undefined) updateData.goal = goal?.trim() || null
    if (collage !== undefined) updateData.collage = collage
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (coverImageFilename !== undefined) updateData.coverImageFilename = coverImageFilename

    // NEW: Social Media & Online Presence
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl?.trim() || null
    if (threadsUrl !== undefined) updateData.threadsUrl = threadsUrl?.trim() || null
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl?.trim() || null
    if (xUrl !== undefined) updateData.xUrl = xUrl?.trim() || null
    if (linkedInUrl !== undefined) updateData.linkedInUrl = linkedInUrl?.trim() || null
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl?.trim() || null

    // NEW: Content & Communication
    if (posts !== undefined) updateData.posts = posts
    if (podcasts !== undefined) updateData.podcasts = podcasts

    // NEW: Skills & Professional Development
    if (skills !== undefined) updateData.skills = skills
    if (careerAchievements !== undefined) updateData.careerAchievements = careerAchievements
    if (learningGoals !== undefined) updateData.learningGoals = learningGoals

    // NEW: Services & Professional Network
    if (servicesOffered !== undefined) updateData.servicesOffered = servicesOffered
    if (professionalAssociations !== undefined) updateData.professionalAssociations = professionalAssociations
    if (professionalBooks !== undefined) updateData.professionalBooks = professionalBooks

    // NEW: Projects & Expertise Sharing
    if (sideProjects !== undefined) updateData.sideProjects = sideProjects
    if (askMeAbout !== undefined) updateData.askMeAbout = askMeAbout
    if (weeklyTreasureWishlist !== undefined) updateData.weeklyTreasureWishlist = weeklyTreasureWishlist

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        industry: true,
        role: true,
        bio: true,
        title: true,
        yearsInBusiness: true,
        interests: true,
        profileImage: true,
        profileImageFilename: true,
        isPublic: true,
        isActive: true,
        isAdmin: true,
        isMembership: true,
        isSuperUser: true,
        membershipStatus: true,
        joinedAt: true,
        expiresAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        // NEW: All new fields in select
        goal: true,
        collage: true,
        coverImage: true,
        coverImageFilename: true,
        facebookUrl: true,
        threadsUrl: true,
        youtubeUrl: true,
        xUrl: true,
        linkedInUrl: true,
        portfolioUrl: true,
        posts: true,
        podcasts: true,
        skills: true,
        careerAchievements: true,
        learningGoals: true,
        servicesOffered: true,
        professionalAssociations: true,
        professionalBooks: true,
        sideProjects: true,
        askMeAbout: true,
        weeklyTreasureWishlist: true,
        chapter: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    })

    // Calculate computed fields
    const usershipDays = updatedUser.joinedAt
      ? Math.floor((new Date().getTime() - new Date(updatedUser.joinedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    const isExpiringSoon = updatedUser.expiresAt
      ? Math.floor((new Date(updatedUser.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30
      : false

    const isProfileComplete = !!(
      updatedUser.name?.trim() &&
      updatedUser.email?.trim() &&
      updatedUser.company?.trim() &&
      updatedUser.industry?.trim()
    )

    // Track what fields were changed
    const changedFields = Object.keys(updateData).filter((key) => {
      if (key === 'updatedAt') return false

      const oldValue = (existingUser as any)[key]
      const newValue = updateData[key]

      if (Array.isArray(newValue) && Array.isArray(oldValue)) {
        return JSON.stringify(newValue) !== JSON.stringify(oldValue)
      }
      return newValue !== oldValue
    })

    // Log success
    await createLog('info', 'User profile updated successfully', {
      location: ['app route - PUT /api/user/<chapterId>/<userId>/me'],
      message: 'User profile updated successfully',
      name: 'UserProfileUpdated',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      chapterId,
      userId,
      userEmail: '',
      changedFields,
      previousName: existingUser.name,
      newName: updateData.name
    })

    return NextResponse.json(
      {
        user: {
          ...updatedUser,
          // Add computed fields
          isProfileComplete,
          usershipDays,
          isExpiringSoon
        },
        meta: {
          chapterId,
          lastUpdated: updatedUser.updatedAt,
          changedFields,
          profileCompleteness: {
            isComplete: isProfileComplete,
            missingFields: [
              !updatedUser.name?.trim() && 'name',
              !updatedUser.company?.trim() && 'company',
              !updatedUser.industry?.trim() && 'industry',
              !updatedUser.phone?.trim() && 'phone'
            ].filter(Boolean)
          },
          usership: {
            status: updatedUser.membershipStatus,
            joinedDaysAgo: usershipDays,
            expiresAt: updatedUser.expiresAt,
            isExpiringWithin30Days: isExpiringSoon
          }
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    return await handleApiError({
      error,
      req,
      action: 'Update user profile',
      sliceName: sliceUser
    })
  }
}
