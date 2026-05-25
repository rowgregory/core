import prisma from '@/prisma/client'

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        membershipStatus: 'ACTIVE'
      },
      orderBy: [{ membershipStatus: 'asc' }, { createdAt: 'asc' }]
    })

    const statusOrder: Record<string, number> = {
      ACTIVE: 0,
      INACTIVE: 1,
      PENDING: 2,
      FLAGGED: 3
    }

    const sortedUsers = users.sort((a, b) => {
      const aOrder = statusOrder[a.membershipStatus] ?? 99
      const bOrder = statusOrder[b.membershipStatus] ?? 99
      return aOrder - bOrder
    })

    return { success: true, data: sortedUsers }
  } catch {
    return {
      success: false,
      error: 'Failed to fetch users'
    }
  }
}
