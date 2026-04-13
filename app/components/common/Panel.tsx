export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark ${className}`}>
      {children}
    </div>
  )
}
