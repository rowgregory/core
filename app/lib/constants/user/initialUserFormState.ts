import { User, UserWithMeta } from '@/types/user'
import { initialChapterFormState } from '../chapter/initialChapterFormState'

export const initialUserFormState: User = {
  // Application & Review Process
  isFinalDecisionMade: false,
  rejectionReason: '',
  finalDecisionAt: null,
  backgroundCheckCompletedAt: null,
  initialReviewCompletedAt: null,
  isBackgroudCheckCompleted: false,
  isInitialReviewCompleted: false,
  rejectedStep: null,
  rejectedAt: '',
  hasCompletedApplication: false,

  // System Fields
  id: '',
  createdAt: new Date(),
  updatedAt: new Date(),

  // Basic Information
  name: '',
  email: '',
  phone: null,
  company: '',
  industry: '',
  location: '',
  bio: '',
  title: '',
  website: '',
  yearsInBusiness: '',
  businessLicenseNumber: '',
  role: '',

  // Coastal Referral Exchange Membership
  chapterId: 'cm3kx7p2q0001abcdefghijk',
  joinedAt: undefined,
  expiresAt: undefined,
  membershipStatus: 'ACTIVE',

  // Profile & Networking
  interests: [],
  profileImage: '',
  profileImageFilename: '',
  isPublic: true,
  isActive: true,

  // NEW: Professional Goals & Media
  goal: '',
  collage: null,
  coverImage: '',
  coverImageFilename: '',

  // NEW: Social Media & Online Presence
  facebookUrl: '',
  threadsUrl: '',
  youtubeUrl: '',
  xUrl: '',
  linkedInUrl: '',
  portfolioUrl: '',

  // NEW: Content & Communication
  posts: null,
  podcasts: null,

  // NEW: Skills & Professional Development
  skills: [],
  careerAchievements: [],
  learningGoals: [],

  // NEW: Services & Professional Network
  servicesOffered: null,
  professionalAssociations: null,
  professionalBooks: null,

  // NEW: Projects & Expertise Sharing
  sideProjects: null,
  askMeAbout: null,

  // Verification & Security
  lastLoginAt: null,
  isAdmin: false,
  isSuperUser: false,

  // NextAuth fields
  image: null,

  // Relationships (optional, loaded when needed)
  requestedMeetings: undefined,
  receivedMeetings: undefined,
  givenCredits: undefined,
  receivedCredits: undefined,
  accounts: undefined,
  sessions: undefined,
  logs: undefined,
  signals: undefined
}

const initialMetaUserData = {
  chapterId: '',
  lastUpdated: new Date().toISOString(),
  membership: {
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    isExpiringWithin30Days: false,
    joinedDaysAgo: 0,
    status: 'PENDING'
  },
  profileCompleteness: {
    isComplete: false,
    missingFields: ['name', 'email', 'company', 'industry', 'location', 'bio', 'title', 'website'] // Common required fields
  }
}

export const createInitialUserWithMeta = (): UserWithMeta => ({
  ...initialUserFormState,
  chapter: initialChapterFormState,
  meta: initialMetaUserData
})
