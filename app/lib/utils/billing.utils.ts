import { BillingOrder } from '@/types/billing.types'

/**
 * Get the next quarterly dues due date as a Date object.
 * Quarterly dues are due on the 15th of Jan, Apr, Jul, Oct.
 */
export function getNextQuarterlyDueDateRaw(from: Date = new Date()): Date {
  const year = from.getFullYear()
  const quarters = [
    new Date(year, 0, 1),
    new Date(year, 3, 1),
    new Date(year, 6, 1),
    new Date(year, 9, 1),
    new Date(year + 1, 0, 1)
  ]
  return quarters.find((d) => d > from)!
}

/**
 * Get the next quarterly dues due date as a long display string.
 * @example "October 15, 2026"
 */
export function getNextQuarterlyDueDate(from: Date = new Date()): string {
  return getNextQuarterlyDueDateRaw(from).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Compute a Stripe billing anchor (Unix timestamp in seconds) for the next
 * annual renewal date. Uses the given month/day, rolling forward to next year
 * if the date has already passed this year. Used to align subscription renewals
 * with a member's join anniversary.
 * @example getAnnualBillingAnchor(5, 14) → next May 14 as Unix seconds.
 */
export function getAnnualBillingAnchor(month: number, day: number): number {
  const today = new Date()
  let anchor = new Date(today.getFullYear(), month - 1, day)
  if (anchor <= today) {
    anchor = new Date(today.getFullYear() + 1, month - 1, day)
  }
  return Math.floor(anchor.getTime() / 1000)
}

/**
 * Compute a Stripe billing anchor (Unix timestamp in seconds) for the next
 * fiscal quarter start. Returns whichever of Jan 1, Apr 1, Jul 1, or Oct 1
 * comes next after today. Used to align quarterly subscriptions so all members
 * are billed at the same time each quarter regardless of when they joined.
 */
export function getQuarterlyBillingAnchor(): number {
  const today = new Date()
  const year = today.getFullYear()

  const quarters = [
    new Date(year, 0, 1),
    new Date(year, 3, 1),
    new Date(year, 6, 1),
    new Date(year, 9, 1),
    new Date(year + 1, 0, 1)
  ]

  const next = quarters.find((q) => q > today)!
  return Math.floor(next.getTime() / 1000)
}

/**
 * Format an order type enum value as a human-readable label.
 * Example: "ANNUAL" → "Annual Membership", "ATTENDANCE_CORRECTION" → "Attendance Correction"
 */
export function fmtType(type: string) {
  switch (type) {
    case 'ANNUAL':
      return 'Annual Membership'
    case 'QUARTERLY':
      return 'Room Dues'
    case 'ATTENDANCE_CORRECTION':
      return 'Attendance Correction'
    default:
      return type
  }
}

/**
 * Determines whether an order represents an actual payment or a pending subscription.
 * Subscriptions without a paid invoice (no hostedInvoiceUrl) are "pending."
 */
export function isPaid(order: BillingOrder): boolean {
  return !!order.hostedInvoiceUrl
}

/**
 * Maps an order status to its display color class. Returns Tailwind text-color
 * utilities (light + dark variants) for use in status badges and labels.
 * Example: paidStatusColor('ACTIVE') → "text-green-600 dark:text-green-400"
 */
export function paidStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-600 dark:text-green-400'
    case 'CANCELLED':
      return 'text-red-500 dark:text-red-400'
    case 'PAST_DUE':
      return 'text-amber-500 dark:text-amber-400'
    default:
      return 'text-muted-light dark:text-muted-dark'
  }
}
