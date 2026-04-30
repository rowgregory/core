export const inputCls =
  'w-full h-12 bg-white dark:bg-bg-dark border border-slate-300 dark:border-border-dark px-3.5 font-nunito text-[15px] text-text-light dark:text-text-dark placeholder:text-slate-400 dark:placeholder:text-muted-dark/50 focus:outline-none focus:border-primary-light dark:focus:border-primary-dark focus:ring-1 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 transition-colors rounded-none'

export function Field({
  label,
  htmlFor,
  optional,
  children
}: {
  label: string
  htmlFor: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-f10 font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
      >
        {label}
        {optional && <span className="ml-2 text-f9 normal-case tracking-normal opacity-60">optional</span>}
      </label>
      {children}
    </div>
  )
}
