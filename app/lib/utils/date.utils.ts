export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function getAllUpcomingThursdays(count: number): Date[] {
  const results: Date[] = []
  const cursor = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  while (cursor.getDay() !== 4) cursor.setDate(cursor.getDate() + 1)
  while (results.length < count) {
    results.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 7)
  }
  return results
}
