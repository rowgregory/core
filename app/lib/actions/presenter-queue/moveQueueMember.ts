'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth'
import { chapterId } from '../../constants/api/chapterId'

export async function moveQueueMember(
  id: string,
  direction: 'up' | 'down'
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const all = await prisma.presenterQueue.findMany({
      where: { chapterId },
      orderBy: { position: 'asc' }
    })

    const idx = all.findIndex((q) => q.id === id)
    if (idx === -1) return { success: false, error: 'Member not found' }

    const swapIdx = direction === 'up' ? (idx - 1 + all.length) % all.length : (idx + 1) % all.length

    const a = all[idx]
    const b = all[swapIdx]

    const TEMP = -999
    await prisma.presenterQueue.update({ where: { id: a.id }, data: { position: TEMP } })
    await prisma.presenterQueue.update({ where: { id: b.id }, data: { position: a.position } })
    await prisma.presenterQueue.update({ where: { id: a.id }, data: { position: b.position } })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to move member' }
  }
}
