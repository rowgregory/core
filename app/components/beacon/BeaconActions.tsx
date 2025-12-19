import { chapterId } from '@/app/lib/constants/api/chapterId'
import deleteFileFromFirebase from '@/app/lib/utils/firebase/deleteFileFromFirebase'
import uploadFileToFirebase from '@/app/lib/utils/firebase/uploadFileToFirebase'
import validateProfileForm from '@/app/lib/utils/validations/validateProfileForm'
import { createFormActions, setIsEditing, setIsNotEditing } from '@/app/redux/features/formSlice'
import { showToast } from '@/app/redux/features/toastSlice'
import { useUpdateMyProfileMutation } from '@/app/redux/services/userApi'
import { useAppDispatch, useFormSelector } from '@/app/redux/store'
import { Edit2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

const BeaconActions = () => {
  const dispatch = useAppDispatch()
  const [updateMyProfile] = useUpdateMyProfileMutation()
  const [isLoading, setIsLoading] = useState(false)
  const { beaconForm, isEditing } = useFormSelector()
  const inputs = beaconForm?.inputs
  const { setErrors, handleUploadProgress } = createFormActions('beaconForm', dispatch)

  const handleSubmit = async () => {
    try {
      if (!validateProfileForm(inputs, setErrors)) return
      setIsLoading(true)

      let filePath = null
      let fileName = null
      let coverImagePath = null
      let coverImageFileName = null
      let mimeType: 'image' | 'video' | undefined = undefined

      // Handle profile image upload
      if (inputs?.fileToUpload) {
        if (inputs?.fileToUploadType.includes('image')) {
          mimeType = 'image'
        } else {
          mimeType = 'video'
        }

        filePath = await uploadFileToFirebase(inputs.fileToUpload, handleUploadProgress, mimeType)
        fileName = inputs.fileToUpload.name
      }

      // Handle cover image upload (if it's a file and not a base64 string)
      if (inputs?.coverImageFile) {
        coverImagePath = await uploadFileToFirebase(inputs.coverImageFile, handleUploadProgress, 'image')
        coverImageFileName = inputs.coverImageFile.name
      }

      // Only process collage if user actually made changes
      let collagePayload = inputs.collage // Default to existing collage

      if (inputs?.newCollage !== undefined) {
        // User made changes to collage - process the new state
        const uploadedCollage = []

        if (inputs.newCollage.length > 0) {
          for (const collageItem of inputs.newCollage) {
            if (collageItem.file) {
              // Upload new files
              const uploadedFileUrl = await uploadFileToFirebase(collageItem.file, handleUploadProgress, 'image')

              uploadedCollage.push({
                fileUrl: uploadedFileUrl,
                filename: collageItem.file.name,
                file: undefined
              })
            } else {
              // Keep existing photos
              uploadedCollage.push(collageItem)
            }
          }
        }

        collagePayload = uploadedCollage // User's new collage state (could be empty if they deleted all)
      }

      // Handle image deletions
      if (inputs?.imagesToDelete && inputs.imagesToDelete.length > 0) {
        for (const imageToDelete of inputs.imagesToDelete) {
          await deleteFileFromFirebase(imageToDelete.filename)
        }
      }

      await updateMyProfile({
        chapterId,
        userId: inputs.id,
        // Basic fields
        ...inputs,

        // Profile image handling
        profileImage: filePath ?? inputs?.profileImage,
        profileImageFilename: fileName ?? inputs?.profileImageFilename,

        // Cover image handling
        coverImage: coverImagePath ?? inputs?.coverImage,
        coverImageFilename: coverImageFileName ?? inputs?.coverImageFilename,

        // All new attributes are already included in ...inputs spread
        // But explicitly listing them here for clarity:

        // Professional Goals & Media
        goal: inputs.goal,
        collage: collagePayload,

        // Social Media & Online Presence
        facebookUrl: inputs.facebookUrl,
        threadsUrl: inputs.threadsUrl,
        youtubeUrl: inputs.youtubeUrl,
        xUrl: inputs.xUrl,
        linkedInUrl: inputs.linkedInUrl,
        portfolioUrl: inputs.portfolioUrl,

        // Content & Communication
        posts: inputs.posts,
        podcasts: inputs.podcasts,

        // Skills & Professional Development
        skills: inputs.skills,
        careerAchievements: inputs.careerAchievements,
        learningGoals: inputs.learningGoals,

        // Services & Professional Network
        servicesOffered: inputs.servicesOffered,
        professionalAssociations: inputs.professionalAssociations,
        professionalBooks: inputs.professionalBooks,

        // Projects & Expertise Sharing
        sideProjects: inputs.sideProjects,
        askMeAbout: inputs.askMeAbout,

        weeklyTreasureWishlist: inputs.weeklyTreasureWishlist
      }).unwrap()

      // router.refresh()

      dispatch(
        showToast({
          type: 'success',
          message: 'Navigator Updated',
          description: 'Your navigator profile settings have been successfully updated.'
        })
      )

      dispatch(setIsNotEditing())
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Update Failed',
          description: error.data.message || 'Unable to update navigator settings'
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setIsNotEditing())
    }
  }, [dispatch])

  return (
    <>
      {!isEditing ? (
        <button
          onClick={() => dispatch(setIsEditing())}
          className="flex items-center sm:space-x-2 text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/30 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
        >
          <Edit2 className="w-5 h-5" />
          <span className="hidden sm:block">Edit Beacon</span>
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center sm:space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Save className="w-5 h-5" />
          <span className="hidden sm:block">{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      )}
    </>
  )
}

export default BeaconActions
