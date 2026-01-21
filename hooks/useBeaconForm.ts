import { setInputs } from '@/app/lib/redux/features/formSlice'
import { useAppDispatch } from '@/app/lib/redux/store'
import { useEffect } from 'react'

const useBeaconForm = (data: any) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data) {
      dispatch(
        setInputs({
          formName: 'beaconForm',
          data: {
            id: data?.id,
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            company: data?.company || '',
            industry: data?.industry || '',
            role: data?.role || '',
            bio: data?.bio || '',
            website: data?.website || '',
            title: data?.title || '',
            busineessLicenseNumber: data?.busineessLicenseNumber || '',
            yearsInBusiness: data?.yearsInBusiness || '',
            interests: data?.interests || [],
            profileImage: data?.profileImage || null,
            profileImageFilename: data?.profileImageFilename || null,
            isPublic: data?.isPublic ?? true,
            isActive: data?.isActive ?? true,
            isAdmin: data?.isAdmin ?? false,
            membershipStatus: data?.membershipStatus || '',
            joinedAt: data?.joinedAt || null,
            expiresAt: data?.expiresAt || null,
            lastLoginAt: data?.lastLoginAt || null,
            createdAt: data?.createdAt || null,
            updatedAt: data?.updatedAt || null,
            isProfileComplete: data?.isProfileComplete ?? false,
            membershipDays: data?.membershipDays || 0,
            isExpiringSoon: data?.isExpiringSoon ?? false,

            // NEW: Professional Goals & Media
            goal: data?.goal || '',
            collage: data?.collage || [],
            coverImage: data?.coverImage || '',
            coverImageFilename: data?.coverImageFilename || '',

            // NEW: Social Media & Online Presence
            facebookUrl: data?.facebookUrl || '',
            threadsUrl: data?.threadsUrl || '',
            youtubeUrl: data?.youtubeUrl || '',
            xUrl: data?.xUrl || '',
            linkedInUrl: data?.linkedInUrl || '',
            portfolioUrl: data?.portfolioUrl || '',

            // NEW: Content & Communication
            posts: data?.posts || [],
            podcasts: data?.podcasts || [],

            // NEW: Skills & Professional Development
            skills: data?.skills || [],
            careerAchievements: data?.careerAchievements || [],
            learningGoals: data?.learningGoals || [],

            // NEW: Services & Professional Network
            servicesOffered: data?.servicesOffered || [],
            professionalAssociations: data?.professionalAssociations || [],
            professionalBooks: data?.professionalBooks || [],

            // NEW: Projects & Expertise Sharing
            sideProjects: data?.sideProjects || [],
            askMeAbout: data?.askMeAbout || [],

            weeklyTreasureWishlist: data?.weeklyTreasureWishlist || '',

            chapter: {
              id: data?.chapter?.id || '',
              name: data?.chapter?.name || '',
              location: data?.chapter?.location || ''
            },
            meta: {
              chapterId: data?.meta?.chapterId || '',
              lastUpdated: data?.meta?.lastUpdated || null,
              profileCompleteness: {
                isComplete: data?.meta?.profileCompleteness?.isComplete ?? false,
                missingFields: data?.meta?.profileCompleteness?.missingFields || []
              },
              membership: {
                status: data?.meta?.membership?.status || '',
                joinedDaysAgo: data?.meta?.membership?.joinedDaysAgo || 0,
                expiresAt: data?.meta?.membership?.expiresAt || null,
                isExpiringWithin30Days: data?.meta?.membership?.isExpiringWithin30Days ?? false
              }
            }
          }
        })
      )
    }
  }, [data, dispatch])
}

export default useBeaconForm
