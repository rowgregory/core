import { signOut, useSession } from 'next-auth/react'
import { Home, LayoutDashboard, LogOut, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { getTodayLabel } from '@/app/lib/utils/time.utils'
import { getGreeting } from '@/app/lib/utils/common/getGreeting'

const sharedCls = `flex items-center gap-2 h-9 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors text-f10 font-mono tracking-[0.15em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark`

export function Greeting({ currentUser }) {
  const session = useSession()
  const firstName = currentUser.name.split(' ')[0]
  const greeting = getGreeting()
  const today = getTodayLabel()
  const isAdmin = session.data?.user?.isAdmin ?? false

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-f10 font-mono tracking-[0.18em] uppercase text-primary-light dark:text-primary-dark mb-1.5">
            {today}
          </p>
          <h1 className="font-sora font-black text-[26px] xs:text-[30px] text-text-light dark:text-text-dark tracking-tight leading-[1.1]">
            {greeting}, {firstName}.
          </h1>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="shrink-0 mt-1 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          aria-label="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>

      {/* Nav links on their own row */}
      <div className="flex items-center gap-2">
        <Link href="/" className={sharedCls}>
          <Home size={12} aria-hidden="true" />
          Home
        </Link>
        <Link href="/profile" className={sharedCls}>
          <UserCircle size={12} aria-hidden="true" />
          Profile
        </Link>
        {isAdmin && (
          <Link href="/admin" className={sharedCls}>
            <LayoutDashboard size={12} aria-hidden="true" />
            Admin
          </Link>
        )}
      </div>
    </div>
  )
}
