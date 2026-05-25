import { Chapter } from '@/types/user.types'

export const initialChapterFormState: Chapter = {
  id: '',
  name: '',
  location: '',
  meetingDay: '',
  meetingTime: '',
  meetingFrequency: '',
  createdAt: '',
  updatedAt: '',
  hasUnlockedMuster: false,
  hasUnlockedBooty: false,
  hasUnlockedGrog: false
}
