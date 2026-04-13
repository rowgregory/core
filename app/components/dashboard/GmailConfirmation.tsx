import Link from 'next/link'

export function GmailConfirmation() {
  return (
    <div className="relative overflow-hidden border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-4 py-2 flex items-center justify-between gap-4">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 dark:text-slate-700 pointer-events-none select-none"
        fill="currentColor"
      >
        <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064 5.96 5.96 0 0 1 4.123 1.632l2.913-2.913A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
      </svg>
      <div className="relative z-10 flex items-center gap-3 min-w-0">
        <span className="text-f10 font-mono tracking-[0.15em] uppercase shrink-0">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">m</span>
          <span className="text-yellow-500">a</span>
          <span className="text-blue-500">i</span>
          <span className="text-green-500">l</span>
        </span>
        <span className="text-border-light dark:text-border-dark" aria-hidden="true">
          ·
        </span>
        <p className="text-[12px] font-nunito text-muted-light dark:text-muted-dark truncate">
          You can now sign in with Google
        </p>
      </div>
      <Link
        href="/profile"
        className="text-f10 font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark hover:opacity-70 transition-opacity whitespace-nowrap shrink-0 relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
      >
        Update →
      </Link>
    </div>
  )
}
