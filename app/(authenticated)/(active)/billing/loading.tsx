export default function BillingLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <main className="max-w-170 mx-auto px-4 pb-12">
        {/* Header */}
        <div className="pt-7 pb-6 border-b border-border-light dark:border-border-dark">
          {/* Back link */}
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            <div className="h-3 w-20 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            <div className="h-3 w-12 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>

          {/* Title row */}
          <div className="flex items-end justify-between gap-4">
            <div className="h-9 w-32 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
            <div className="h-3 w-40 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse pb-1" />
          </div>
        </div>

        {/* Sections */}
        <div className="pt-6 flex flex-col gap-8">
          <SectionSkeleton rows={3} />
          <SectionSkeleton rows={2} />
        </div>
      </main>
    </div>
  )
}

function SectionSkeleton({ rows }: { rows: number }) {
  return (
    <div>
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-3 h-px bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
        <div className="h-3 w-44 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
      </div>

      {/* Rows */}
      <div className="border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            {/* Left — date + label */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="h-4 w-2/3 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
              <div className="h-3 w-1/3 bg-muted-light/10 dark:bg-muted-dark/10 animate-pulse" />
            </div>

            {/* Right — amount */}
            <div className="shrink-0 h-4 w-16 bg-muted-light/15 dark:bg-muted-dark/15 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
