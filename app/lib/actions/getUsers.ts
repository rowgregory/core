import prisma from '@/prisma/client'

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return users
  } catch {
    return {
      success: false,
      error: 'Failed to fetch users'
    }
  }
}
