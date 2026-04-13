export function ActivityStats({ stats }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
      {/* Meetings */}
      <div className="border border-border-light dark:border-border-dark px-4 py-4 flex xs:flex-col gap-4 xs:gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 xs:mb-3">
            Face-2-Faces
          </p>
          <p className="font-sora font-black text-[32px] xs:text-[36px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
            {stats.parleyThisWeek}
          </p>
          <p className="text-f10 font-mono text-muted-light dark:text-muted-dark mt-0.5">this week</p>
        </div>
        <div className="flex xs:mt-auto xs:pt-3 xs:border-t xs:border-border-light xs:dark:border-border-dark items-center justify-end shrink-0 xs:shrink xs:justify-end">
          <p className="text-f10 font-mono text-text-light dark:text-text-dark font-bold">{stats.totalParleys} total</p>
        </div>
      </div>

      {/* Referrals */}
      <div className="border border-border-light dark:border-border-dark px-4 py-4 flex xs:flex-col gap-4 xs:gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 xs:mb-3">
            Referrals
          </p>
          <p className="font-sora font-black text-[32px] xs:text-[36px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
            {stats.treasureMapsThisWeek}
          </p>
          <p className="text-f10 font-mono text-muted-light dark:text-muted-dark mt-0.5">this week</p>
        </div>
        <div className="flex xs:mt-auto xs:pt-3 xs:border-t xs:border-border-light xs:dark:border-border-dark items-center justify-end shrink-0 xs:shrink xs:justify-end">
          <p className="text-f10 font-mono text-text-light dark:text-text-dark font-bold">
            {stats.totalTreasureMaps} total
          </p>
        </div>
      </div>

      {/* Closed */}
      <div className="border border-border-light dark:border-border-dark px-4 py-4 flex xs:flex-col gap-4 xs:gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-f10 font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 xs:mb-3">
            Closed Business
          </p>
          <p className="font-sora font-black text-[32px] xs:text-[36px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
            {stats.anchorsThisWeek}
          </p>
          <p className="text-f10 font-mono text-muted-light dark:text-muted-dark mt-0.5">
            {stats.closedAmountThisWeek} this week
          </p>
        </div>
        <div className="flex xs:mt-auto xs:pt-3 xs:border-t xs:border-border-light xs:dark:border-border-dark items-center justify-between space-x-2 xs:space-x-auto shrink-0 xs:shrink">
          <p className="text-f10 font-mono text-muted-light dark:text-muted-dark">{stats.totalClosedAmount}</p>
          <p className="text-f10 font-mono text-text-light dark:text-text-dark font-bold">{stats.totalAnchors} total</p>
        </div>
      </div>
    </div>
  )
}
