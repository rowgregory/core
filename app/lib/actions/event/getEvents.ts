import prisma from '@/prisma/client'
import { auth } from '../../auth'
import { chapterId } from '../../constants/api/chapterId'

export async function getEvents() {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const events = await prisma.event.findMany({
    where: { chapterId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      org: true,
      name: true,
      description: true,
      externalLink: true,
      createdAt: true
    }
  })

  return {
    success: true,
    data: events.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString()
    }))
  }
}
