import prisma from '@/prisma/client'
import { now } from '../../date/formatDate'

export const memberWeeklyActivityFactory = {
  chart: async (id: string) => {
    // Force start of the week = Thursday
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday...
    const diffToThursday = (dayOfWeek + 3) % 7 // convert so Thursday = 0
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - diffToThursday)
    weekStart.setHours(0, 0, 0, 0)

    const daysShort = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']

    const weeklyActivity = []

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(weekStart)
      dayStart.setDate(weekStart.getDate() + i)

      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayStart.getDate() + 1)

      const parleys = await prisma.parley.count({
        where: {
          requesterId: id,
          scheduledAt: { gte: dayStart, lt: dayEnd }
        }
      })

      const treasureMaps = await prisma.treasureMap.count({
        where: {
          giverId: id,
          OR: [
            { closedAt: { gte: dayStart, lt: dayEnd } },
            {
              AND: [{ closedAt: null }, { createdAt: { gte: dayStart, lt: dayEnd } }]
            }
          ]
        }
      })

      const anchors = await prisma.anchor.count({
        where: {
          giverId: id,
          closedDate: { gte: dayStart, lt: dayEnd }
        }
      })

      weeklyActivity.push({
        day: daysShort[i],
        parleys,
        treasureMaps,
        anchors
      })
    }

    return { weeklyActivity }
  }
}
