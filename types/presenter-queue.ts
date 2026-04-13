export type QueueMember = {
  id: string
  userId: string
  name: string
  company: string
  industry: string
  position: number
}

export type ScheduledPresenter = {
  userId: string
  name: string
  company: string
  date: string // ISO string
  isNext: boolean
  isYou: boolean
  type: 'presenter' | 'visitor_day' | 'off'
}
