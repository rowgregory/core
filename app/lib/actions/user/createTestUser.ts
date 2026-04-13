'use server'

import prisma from '@/prisma/client'
import { chapterId } from '../../constants/api/chapterId'

export async function createTestUser() {
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: `rowgregory@gmail.com`,
      role: 'MEMBER',
      company: 'Test Company',
      industry: 'Technology',
      membershipStatus: 'ACTIVE',
      isAdmin: false,
      isSuperUser: false,
      isMembership: false,
      isPublic: false,
      isActive: true,
      hasCompletedApplication: false,
      tempId: '',
      chapterId
    }
  })

  console.log('✓ Test user created:', user.id, user.email)
  return { success: true, data: user }
}
