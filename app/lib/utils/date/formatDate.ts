// lib/shared/dateUtils.ts
export type DateInput = string | number | Date | null | undefined

export interface DateFormatOptions {
  style?: 'short' | 'medium' | 'long' | 'full' | 'month-day'
  includeTime?: boolean
  fallback?: string
}

export const formatDate = (date: DateInput, options: DateFormatOptions & { includeSeconds?: boolean } = {}): string => {
  const { style = 'medium', includeTime = false, includeSeconds = false, fallback = 'Never' } = options

  if (!date) return fallback

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return fallback

  let formatOptions: Intl.DateTimeFormatOptions = {}

  switch (style) {
    case 'short':
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      break
    case 'medium':
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      break
    case 'long':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      break
    case 'full':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }
      // Add seconds to full style if requested
      if (includeSeconds) {
        formatOptions.second = '2-digit'
      }
      break
    case 'month-day':
      formatOptions = {
        month: 'short',
        day: 'numeric'
      }
      break
  }

  if (includeTime && style !== 'full') {
    formatOptions.hour = 'numeric'
    formatOptions.minute = '2-digit'
    if (includeSeconds) {
      formatOptions.second = '2-digit'
    }
  }

  return new Intl.DateTimeFormat('en-US', {
    ...formatOptions,
    timeZone: 'America/New_York'
  }).format(dateObj)
}

// Convenience functions
export const formatDateShort = (date: DateInput) => formatDate(date, { style: 'short' })

export const formatDateLong = (date: DateInput) => formatDate(date, { style: 'long' })

export const formatDateTime = (date: DateInput) => formatDate(date, { style: 'medium', includeTime: true })

// formatDate(date)                               "Jan 15, 2024"
// formatDate(date, { style: 'short' })          "Jan 15, 2024"
// formatDate(date, { style: 'long' })           "Monday, January 15, 2024"
// formatDate(date, { includeTime: true })       "Jan 15, 2024, 2:30 PM"
// formatDate(null, { fallback: 'Not set' })     "Not set"

// Convenience functions:
// formatDateShort(date)      // "Jan 15, 2024"
// formatAppointmentDate(date) // "Monday, January 15, 2024"
// formatDateTime(date)       // "Jan 15, 2024, 2:30 PM"

export const convertToDateFormat = (dateTimeString: string | Date): string => {
  if (!dateTimeString) return ''

  const date = dateTimeString instanceof Date ? dateTimeString : new Date(dateTimeString)

  return date.toISOString().split('T')[0]
}

export const formatDateForInput = (isoString: string): string => {
  if (!isoString) return ''

  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const formatDateTimeForInput = (isoString: string): string => {
  if (!isoString) return ''

  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() is 0-indexed
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const formatDateRange = (startDays: number, endDays: number) => {
  const start = new Date()
  start.setDate(start.getDate() + startDays)
  const end = new Date()
  end.setDate(end.getDate() + endDays)
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export const formatMonth = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

export const isCurrentMonth = (date: Date, currentMonth: Date) => {
  return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()
}

export const isToday = (date: Date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// COMMON VARIABLES
export const now = new Date()

// Current month
export const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
export const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

// Last month
export const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
export const startOfThisMonthCopy = new Date(now.getFullYear(), now.getMonth(), 1) // for clarity

export const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
export const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
