'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth'

export async function swapQueuePositions(idA: string, idB: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const [a, b] = await Promise.all([
      prisma.presenterQueue.findUnique({ where: { id: idA } }),
      prisma.presenterQueue.findUnique({ where: { id: idB } })
    ])

    if (!a || !b) return { success: false, error: 'Member not found' }

    // Use a temp position to avoid unique constraint collision
    const TEMP = -999
    await prisma.presenterQueue.update({ where: { id: idA }, data: { position: TEMP } })
    await prisma.presenterQueue.update({ where: { id: idB }, data: { position: a.position } })
    await prisma.presenterQueue.update({ where: { id: idA }, data: { position: b.position } })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to swap positions' }
  }
}
