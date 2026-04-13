import { useSession } from 'next-auth/react'
import { LayoutDashboard, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { getTodayLabel } from '@/app/lib/utils/time.utils'
import { getGreeting } from '@/app/lib/utils/common/getGreeting'

const sharedCls = `flex items-center gap-2 h-9 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-[0.15em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark`

export function Greeting({ currentUser }) {
  const session = useSession()
  const firstName = currentUser.name.split(' ')[0]

  const greeting = getGreeting()
  const today = getTodayLabel()

  const isAdmin = session.data.user.isAdmin ?? false
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-f10 font-mono tracking-[0.18em] uppercase text-primary-light dark:text-primary-dark mb-1.5">
          {today}
        </p>
        <h1 className="font-sora font-black text-[22px] xs:text-[30px] text-text-light dark:text-text-dark tracking-tight leading-[1.1] truncate">
          {greeting}, {firstName}.
        </h1>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 mt-1">
        {isAdmin && (
          <Link href="/admin" className={sharedCls}>
            <LayoutDashboard size={12} aria-hidden="true" />
            <span className="hidden xs-2:inline">Admin</span>
          </Link>
        )}
        <Link href="/profile" className={sharedCls}>
          <UserCircle size={12} aria-hidden="true" />
          <span className="hidden xxs:inline">Profile</span>
        </Link>
      </div>
    </div>
  )
}
