'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { chapterId } from '../constants/api/chapterId'

export async function initializePresenterQueue(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await prisma.presenterQueue.deleteMany({ where: { chapterId } })
    console.log('✓ Cleared existing presenter queue')

    const members = await prisma.user.findMany({
      where: { chapterId, membershipStatus: 'ACTIVE' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })

    console.log(`→ Found ${members.length} active members`)

    for (const [i, member] of members.entries()) {
      await prisma.presenterQueue.create({
        data: { userId: member.id, chapterId, position: i }
      })
      console.log(`✓ [${i + 1}/${members.length}] ${member.name}`)
    }

    console.log('✓ Presenter queue initialized successfully')
    return { success: true }
  } catch (error) {
    console.error('✗ Failed to initialize presenter queue:', error)
    return { success: false, error: 'Failed to initialize queue' }
  }
}
