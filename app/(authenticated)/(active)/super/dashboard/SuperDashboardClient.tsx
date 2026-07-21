'use client'

interface RevenueBlock {
  total: number
  annual: number
  quarterly: number
  ytd: number
  qtd: number
  ytdAnnual: number
  ytdQuarterly: number
  qtdAnnual: number
  qtdQuarterly: number
  count: number
}

interface Stats {
  activeMembers: number
  pendingApplicants: number
  totalOrders: number
  active: RevenueBlock
  scheduled: RevenueBlock
  incomplete: RevenueBlock
  combined: RevenueBlock
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function StatCard({
  label,
  value,
  sub,
  accent = false
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div
      className={`border p-5 flex flex-col gap-1 ${
        accent
          ? 'border-primary-light/30 dark:border-primary-dark/30 bg-primary-light/5 dark:bg-primary-dark/5'
          : 'border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark'
      }`}
    >
      <p className="text-[9.5px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark">
        {label}
      </p>
      <p
        className={`font-sora font-black text-[26px] tracking-tight leading-none ${
          accent ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] font-nunito text-muted-light dark:text-muted-dark mt-0.5">{sub}</p>}
    </div>
  )
}

function SectionLabel({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div className="flex items-center gap-3 mt-8 mb-3 first:mt-0">
      <p className="text-[9.5px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
        {children}
      </p>
      {badge && (
        <span className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark">
          {badge}
        </span>
      )}
    </div>
  )
}

function RevenueSection({
  label,
  badge,
  block,
  quarter,
  year,
  accent = false
}: {
  label: string
  badge: string
  block: RevenueBlock
  quarter: string
  year: number
  accent?: boolean
}) {
  return (
    <>
      <SectionLabel badge={`${block.count} orders`}>{label}</SectionLabel>
      <div className="grid grid-cols-9 gap-3">
        {/* All time */}
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <div className="col-span-3">
            <p className="text-[8.5px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 border-b border-border-light dark:border-border-dark pb-1">
              All Time
            </p>
          </div>
          <StatCard label="Total" value={fmt(block.total)} accent={accent} />
          <StatCard label="Annual" value={fmt(block.annual)} />
          <StatCard label="Quarterly" value={fmt(block.quarterly)} />
        </div>

        {/* YTD */}
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <div className="col-span-3">
            <p className="text-[8.5px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 border-b border-border-light dark:border-border-dark pb-1">
              YTD · {year}
            </p>
          </div>
          <StatCard label="Total" value={fmt(block.ytd)} accent={accent} />
          <StatCard label="Annual" value={fmt(block.ytdAnnual)} />
          <StatCard label="Quarterly" value={fmt(block.ytdQuarterly)} />
        </div>

        {/* QTD */}
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <div className="col-span-3">
            <p className="text-[8.5px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2 border-b border-border-light dark:border-border-dark pb-1">
              {quarter} · {year}
            </p>
          </div>
          <StatCard label="Total" value={fmt(block.qtd)} accent={accent} />
          <StatCard label="Annual" value={fmt(block.qtdAnnual)} />
          <StatCard label="Quarterly" value={fmt(block.qtdQuarterly)} />
        </div>
      </div>
    </>
  )
}

export default function SuperDashboardClient({ stats }: { stats: Stats }) {
  const now = new Date()
  const quarter = ['Q1', 'Q2', 'Q3', 'Q4'][Math.floor(now.getMonth() / 3)]
  const year = now.getFullYear()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark mb-1">
            Super · Admin
          </p>
          <h1 className="font-sora font-black text-[26px] text-text-light dark:text-text-dark tracking-tight">
            Dashboard
          </h1>
        </div>
        <span className="text-[11px] font-mono text-on-dark">
          {quarter} · {year}
        </span>
      </div>

      {/* Membership snapshot */}
      <SectionLabel>Membership</SectionLabel>
      <div className="grid grid-cols-3 gap-4 mb-2">
        <StatCard label="Active Members" value={stats.activeMembers.toString()} accent />
        <StatCard
          label="Pending Applications"
          value={stats.pendingApplicants.toString()}
          sub={stats.pendingApplicants > 0 ? 'Awaiting review' : 'All clear'}
        />
        <StatCard label="Total Orders" value={stats.totalOrders.toString()} sub="All statuses combined" />
      </div>

      {/* Divider */}
      <div className="border-t border-border-light dark:border-border-dark mt-8" />

      <RevenueSection label="Active Revenue" badge="" block={stats.active} quarter={quarter} year={year} accent />
      <RevenueSection label="Scheduled Revenue" badge="" block={stats.scheduled} quarter={quarter} year={year} />
      <RevenueSection label="Incomplete Revenue" badge="" block={stats.incomplete} quarter={quarter} year={year} />
      <RevenueSection
        label="Combined · All Statuses"
        badge=""
        block={stats.combined}
        quarter={quarter}
        year={year}
        accent
      />
    </div>
  )
}
