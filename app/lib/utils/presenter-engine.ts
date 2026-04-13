export function getUpcomingMeetingDates(
  cancelledDates: string[],
  visitorDayDates: string[],
  count: number = 52
): string[] {
  const results = []
  const cancelled = new Set(cancelledDates.map((d) => toDateKey(new Date(d))))
  const visitorDays = new Set(visitorDayDates.map((d) => toDateKey(new Date(d))))

  const nowEST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  nowEST.setHours(0, 0, 0, 0)

  const cursor = new Date(nowEST)
  while (cursor.getDay() !== 4) cursor.setDate(cursor.getDate() + 1)

  let safety = 0
  while (results.length < count && safety < 500) {
    safety++
    const key = toDateKey(cursor)
    if (!cancelled.has(key) && !visitorDays.has(key)) {
      results.push(key) // ← store as 'YYYY-M-D' string, not Date object
    }
    cursor.setDate(cursor.getDate() + 7)
  }

  return results
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

// Zip queue with upcoming dates — wraps around infinitely
export function buildSchedule(
  queue: { userId: string; name: string; position: number }[],
  dates: Date[],
  startIndex: number = 0 // which queue position goes first
): { userId: string; name: string; date: Date }[] {
  if (!queue.length || !dates.length) return []
  const sorted = [...queue].sort((a, b) => a.position - b.position)
  return dates.map((date, i) => {
    const member = sorted[(startIndex + i) % sorted.length]
    return { userId: member.userId, name: member.name, date }
  })
}

// Get ALL Thursdays (past and future) from a given start date
export function getAllThursdaysFrom(startDate: Date, count: number): Date[] {
  const results: Date[] = []
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  while (cursor.getDay() !== 4) cursor.setDate(cursor.getDate() + 1)
  while (results.length < count) {
    results.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 7)
  }
  return results
}

// Count past actual meeting Thursdays since a given date
export function countPastMeetingThursdays(since: Date, cancelledDates: string[], visitorDates: string[]): number {
  const nowEST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  nowEST.setHours(0, 0, 0, 0)

  const cancelled = new Set(cancelledDates.map((d) => toDateKey(new Date(d))))
  const visitors = new Set(visitorDates.map((d) => toDateKey(new Date(d))))

  return getAllThursdaysFrom(since, 200).filter((d) => {
    if (d >= nowEST) return false
    const key = toDateKey(d)
    if (cancelled.has(key)) return false
    if (visitors.has(key)) return false
    return true
  }).length
}
