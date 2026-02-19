import prisma from '../prisma/client.ts'

async function showUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { lastLoginAt: 'desc' },
      select: {
        name: true,
        email: true,
        lastLoginAt: true,
        membershipStatus: true
      }
    })

    console.table(
      users.map((u) => ({
        name: u.name,
        email: u.email,
        status: u.membershipStatus,
        lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'
      }))
    )
  } catch (error) {
    console.error('💥 Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

showUsers()
