'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth'

export async function reorderQueue(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await Promise.all(orderedIds.map((id, i) => prisma.presenterQueue.update({ where: { id }, data: { position: i } })))

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder queue' }
  }
}
