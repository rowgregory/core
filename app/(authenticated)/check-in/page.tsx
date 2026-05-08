import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import { checkIn } from '@/app/lib/actions/attendance/checkIn'
import CheckInClient from './CheckInClient'

export default async function CheckInPage({ searchParams }: { searchParams: Promise<{ date: string }> }) {
  const { date } = await searchParams
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/check-in')
  }

  // Run check-in server-side on page load
  const result = await checkIn({ date: date ?? undefined })

  return <CheckInClient result={result} userName={session.user.name ?? ''} />
}
