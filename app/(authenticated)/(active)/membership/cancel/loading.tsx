export default function CancelMembershipLoading() {
  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back link placeholder */}
        <div className="inline-flex items-center gap-1.5 mb-4">
          <div className="w-3 h-3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          <div className="h-3 w-28 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
        </div>

        <div className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark">
          {/* Header */}
          <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-border-light dark:border-border-dark">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3.5 h-3.5 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
              <div className="h-3 w-44 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            </div>
            {/* Heading */}
            <div className="space-y-2.5">
              <div className="h-8 sm:h-9 w-3/4 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
              <div className="h-8 sm:h-9 w-1/2 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            </div>
            {/* Subhead */}
            <div className="mt-4 space-y-2">
              <div className="h-3.5 w-full bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
              <div className="h-3.5 w-5/6 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
            </div>
          </div>

          {/* What Will Happen */}
          <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-border-light dark:border-border-dark">
            <div className="h-3 w-32 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse mb-4" />

            <ul className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                  <div className="shrink-0 mt-0.5 w-5 h-5 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
                      <div className="h-3 w-4/5 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cancel action area */}
          <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-border-light dark:border-border-dark">
            <div className="h-3 w-44 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse mb-3" />
            <div className="space-y-2 mb-4">
              <div className="h-3.5 w-full bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
              <div className="h-3.5 w-3/4 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
            </div>
            <div className="h-11 w-full sm:w-48 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="h-3 w-48 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
            <div className="h-9 w-24 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  )
}
