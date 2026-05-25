export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark px-4 py-6 sm:py-8">
      <div className="max-w-170 mx-auto space-y-6">
        {/* Dashboard header */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-px bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          <div className="h-3 w-24 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
        </div>

        {/* Outing fund banner */}
        <div className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark overflow-hidden">
          {/* Eyebrow */}
          <div className="px-5 sm:px-6 pt-4 pb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            <div className="h-3 w-32 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Main content row */}
          <div className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            {/* Trophy icon placeholder */}
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />

            {/* Copy + progress bar */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="h-7 sm:h-8 w-3/4 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
              <div className="h-3 w-full bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
              <div className="h-1.5 w-full bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse mt-3" />
              <div className="h-3 w-16 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse mt-1.5" />
            </div>

            {/* CTA */}
            <div className="shrink-0 h-9 w-32 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse self-start sm:self-auto" />
          </div>

          {/* Ticker strip */}
          <div className="border-t border-border-light dark:border-border-dark py-1.5 px-4">
            <div className="h-2.5 w-full bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
          </div>
        </div>

        {/* Attendance panel */}
        <div className="border border-border-light dark:border-border-dark">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between gap-3">
            <div className="h-3 w-32 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            <div className="h-3 w-28 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Heat strip */}
          <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
            {/* Strip header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2.5">
              <div className="h-3 w-44 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
              <div className="hidden sm:flex items-center gap-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-2.5 w-16 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
                ))}
              </div>
            </div>

            {/* 52 placeholder squares */}
            <div className="flex flex-wrap gap-0.5">
              {Array.from({ length: 52 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.75 h-2.75 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse"
                  style={{ animationDelay: `${i * 8}ms` }}
                />
              ))}
            </div>
          </div>

          {/* View History link placeholder */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light dark:border-border-dark">
            <div className="w-3 h-3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            <div className="h-3 w-24 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse flex-1" />
            <div className="h-3 w-3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 border-l-2 border-l-muted-light/15 dark:border-l-muted-dark/15"
              >
                <div className="h-3.5 w-44 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse flex-1" />
                <div className="h-3 w-20 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
