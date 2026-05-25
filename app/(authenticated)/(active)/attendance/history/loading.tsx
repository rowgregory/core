export default function AttendanceHistoryLoading() {
  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back link */}
        <div className="inline-flex items-center gap-1.5 mb-6">
          <div className="w-3 h-3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          <div className="h-3 w-28 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            <div className="h-3 w-36 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Title — two-line block for "Your Record, [firstName]" */}
          <div className="space-y-2">
            <div className="h-9 sm:h-10 w-2/3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Subhead */}
          <div className="mt-3 space-y-2 max-w-2xl">
            <div className="h-4 w-full bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
            <div className="h-4 w-5/6 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <StatCardSkeleton highlight />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Monthly groups */}
        <div className="space-y-6">
          {[0, 1, 2].map((g) => (
            <div key={g}>
              {/* Month label */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-px bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
                <div className="h-3 w-24 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
              </div>

              {/* Row list */}
              <div className="border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
                {[0, 1, 2, 3].map((r) => (
                  <div
                    key={r}
                    className="flex items-center gap-3 px-4 py-2.5 border-l-2 border-l-muted-light/15 dark:border-l-muted-dark/15"
                  >
                    {/* Date placeholder */}
                    <div className="h-3.5 w-48 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse flex-1" />
                    {/* Status placeholder */}
                    <div className="h-3 w-20 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function StatCardSkeleton({ highlight }: { highlight?: boolean }) {
  return (
    <div
      className={`border p-3 sm:p-4 ${
        highlight
          ? 'border-primary-light/40 dark:border-primary-dark/40 bg-primary-light/5 dark:bg-primary-dark/5'
          : 'border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark'
      }`}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-2.5 h-2.5 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
        <div className="h-2.5 w-16 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
      </div>

      {/* Value */}
      <div className="h-7 sm:h-8 w-12 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />

      {/* Sub */}
      <div className="h-2.5 w-20 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse mt-1.5" />
    </div>
  )
}
