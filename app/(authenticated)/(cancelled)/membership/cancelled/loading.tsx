export default function CancelledMembershipLoading() {
  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-6 h-6 border-2 border-border-light dark:border-border-dark border-t-primary-light dark:border-t-primary-dark rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
        <p className="text-f10 font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Loading</p>
      </div>
    </main>
  )
}
