// TreasureMap from database (complete object)
interface ITreasureMap {
  id: string
  createdAt: Date
  updatedAt: Date
  giverId: string
  receiverId: string
  clientName: string
  clientEmail: string | null
  clientPhone: string | null
  serviceNeeded: string
  status: 'GIVEN' | 'ACCEPTED' | 'CONTACTED' | 'CLOSED' | 'DECLINED'
  contactedAt: Date | null
  closedAt: Date | null
  notes: string | null
  giverNotes: string | null
  receiverNotes: string | null
  chapterId: string
  giver: {
    id: string
    name: string
    company: string
    industry: string
    profileImage: string
  }
  receiver: {
    id: string
    name: string
    company: string
    industry: string
    profileImage: string
  }
  chapter: {
    id: string
    name: string
  }
}

// Form state for creating/editing treasure maps
interface TreasureMapFormState {
  giverId: string
  receiverId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceNeeded: string
  status: 'GIVEN' | 'ACCEPTED' | 'CONTACTED' | 'CLOSED' | 'DECLINED'
  contactedAt: string // ISO string for datetime-local input
  closedAt: string // ISO string for datetime-local input
  notes: string
  giverNotes: string
  receiverNotes: string
  chapterId: string
}

// Initial state for creating a new treasure map
const initialTreasureMapFormState: TreasureMapFormState = {
  giverId: '',
  receiverId: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  serviceNeeded: '',
  status: 'GIVEN',
  contactedAt: '',
  closedAt: '',
  notes: '',
  giverNotes: '',
  receiverNotes: '',
  chapterId: ''
}

// Helper function to create initial state with known values
const createInitialTreasureMapState = (currentUserId: string, chapterId: string): TreasureMapFormState => ({
  giverId: currentUserId, // Usually the current user is giving the referral
  receiverId: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  serviceNeeded: '',
  status: 'GIVEN',
  contactedAt: '',
  closedAt: '',
  notes: '',
  giverNotes: '',
  receiverNotes: '',
  chapterId: chapterId
})

// Status options for dropdowns
const TREASURE_MAP_STATUSES = ['GIVEN', 'ACCEPTED', 'CONTACTED', 'CLOSED', 'DECLINED'] as const

// Type for status
type TreasureMapStatus = (typeof TREASURE_MAP_STATUSES)[number]

// Helper to convert database TreasureMap to form state
const treasureMapToFormState = (treasureMap: ITreasureMap): TreasureMapFormState => ({
  giverId: treasureMap.giverId,
  receiverId: treasureMap.receiverId,
  clientName: treasureMap.clientName,
  clientEmail: treasureMap.clientEmail || '',
  clientPhone: treasureMap.clientPhone || '',
  serviceNeeded: treasureMap.serviceNeeded,
  status: treasureMap.status,
  contactedAt: treasureMap.contactedAt ? treasureMap.contactedAt.toISOString().slice(0, 16) : '',
  closedAt: treasureMap.closedAt ? treasureMap.closedAt.toISOString().slice(0, 16) : '',
  notes: treasureMap.notes || '',
  giverNotes: treasureMap.giverNotes || '',
  receiverNotes: treasureMap.receiverNotes || '',
  chapterId: treasureMap.chapterId
})

// Helper to prepare form data for API submission
const prepareFormDataForSubmission = (formData: TreasureMapFormState) => ({
  ...formData,
  clientEmail: formData.clientEmail || null,
  clientPhone: formData.clientPhone || null,
  contactedAt: formData.contactedAt ? new Date(formData.contactedAt).toISOString() : null,
  closedAt: formData.closedAt ? new Date(formData.closedAt).toISOString() : null,
  notes: formData.notes || null,
  giverNotes: formData.giverNotes || null,
  receiverNotes: formData.receiverNotes || null
})

export type { ITreasureMap, TreasureMapFormState, TreasureMapState, TreasureMapStatus }

export {
  initialTreasureMapFormState,
  initialTreasureMapState,
  createInitialTreasureMapState,
  TREASURE_MAP_STATUSES,
  treasureMapToFormState,
  prepareFormDataForSubmission
}
