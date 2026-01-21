import { Camera, User, Eye, EyeOff } from 'lucide-react'
import Picture from '../common/Picture'
import MemberStatusBadge from '../member/MemberStatusBadge'
import { useAppDispatch } from '@/app/lib/redux/store'
import { setInputs } from '@/app/lib/redux/features/formSlice'
import { FC } from 'react'

interface IBeaconHeader {
  inputs: {
    fileToDisplay: string
    fileToUpload: string
    name: string
    industry: string
    company: string
    profileImage?: string
    membershipStatus: string
    isExpiringSoon: boolean
    isPublic: boolean
    role: string
  }
  isEditing: boolean
}

const BeaconHeader: FC<IBeaconHeader> = ({ inputs, isEditing }) => {
  const dispatch = useAppDispatch()
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      dispatch(
        setInputs({
          formName: 'beaconForm',
          data: {
            fileToDisplay: imageUrl,
            fileToUpload: file,
            fileToUploadType: file.type
          }
        })
      )
    }
  }

  return (
    <div className="flex items-center gap-3 xs:gap-4">
      <div className="relative shrink-0">
        <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-linear-to-br from-teal-500 via-cyan-600 to-blue-600 rounded-lg xs:rounded-xl flex items-center justify-center">
          {inputs?.fileToDisplay || inputs?.profileImage ? (
            <Picture
              src={inputs?.fileToDisplay || inputs?.profileImage || ''}
              alt="Beacon"
              className="w-full h-full object-cover rounded-lg xs:rounded-xl"
              priority={false}
            />
          ) : (
            <User className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-white" />
          )}
        </div>
        {isEditing && (
          <label className="absolute -bottom-1.5 xs:-bottom-2 -right-1.5 xs:-right-2 p-1.5 xs:p-2 bg-linear-to-bl from-blue-600 via-cyan-600 to-teal-600 rounded-md xs:rounded-lg cursor-pointer hover:from-cyan-700 hover:via-teal-700 hover:to-blue-700 transition-colors shadow-2xl">
            <Camera className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-base xs:text-lg sm:text-xl font-bold text-white truncate">{inputs.name}</h2>
        <p className="text-gray-400 text-xs xs:text-sm truncate">
          {inputs.industry} at {inputs.company}
        </p>
        <div className="flex items-center flex-wrap gap-2 xs:gap-3 sm:gap-4 mt-1.5 xs:mt-2">
          <MemberStatusBadge status={inputs.membershipStatus} isExpiring={inputs.isExpiringSoon} />
          <span className="flex items-center gap-1 text-[10px] xs:text-xs text-teal-400 whitespace-nowrap">
            {inputs.isPublic ? (
              <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
            ) : (
              <EyeOff className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
            )}
            <span>{inputs.isPublic ? 'Public' : 'Private'}</span>
          </span>
          <span className="text-[10px] xs:text-xs text-gray-400 whitespace-nowrap">Role: {inputs.role}</span>
        </div>
      </div>
    </div>
  )
}

export default BeaconHeader
