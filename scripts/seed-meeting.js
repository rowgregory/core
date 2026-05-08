import { PrismaClient } from '@prisma/client'
import { chapterId } from '../app/lib/constants/api/chapterId.ts'

const prisma = new PrismaClient()

async function main() {
  const meeting = await prisma.meeting.upsert({
    where: {
      chapterId_date: {
        chapterId,
        date: new Date('2026-05-07T00:00:00.000Z')
      }
    },
    create: {
      chapterId,
      date: new Date('2026-05-07T00:00:00.000Z')
    },
    update: {}
  })

  console.log('Meeting created:', meeting.id, meeting.date)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
