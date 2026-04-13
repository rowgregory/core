'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth'
import { chapterId } from '../../constants/api/chapterId'

export async function removeFromQueue(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await prisma.presenterQueue.delete({ where: { id } })

    // Reorder remaining positions
    const remaining = await prisma.presenterQueue.findMany({
      where: { chapterId },
      orderBy: { position: 'asc' }
    })

    await Promise.all(
      remaining.map((r, i) => prisma.presenterQueue.update({ where: { id: r.id }, data: { position: i } }))
    )

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to remove member' }
  }
}
