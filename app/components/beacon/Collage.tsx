import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, FileImage, Plus } from 'lucide-react'
import Picture from '../common/Picture'
import { setInputs } from '@/app/redux/features/formSlice'
import { useAppDispatch } from '@/app/redux/store'

interface CollageImage {
  fileUrl?: string
  id: string
  url: string
  file?: File
  name: string
}

interface CollageProps {
  isEditing: boolean
  initialImages?: CollageImage[]
  onImagesChange?: (images: CollageImage[]) => void
  disabled?: boolean
  maxImages?: number
}

const Collage: React.FC<CollageProps> = ({
  isEditing,
  initialImages = [],
  onImagesChange,
  disabled = false,
  maxImages = 9
}) => {
  const [images, setImages] = useState<CollageImage[]>(initialImages)
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (initialImages) {
      setImages(initialImages)
    }
  }, [initialImages])

  const handleImagesUpdate = (newImages: CollageImage[]) => {
    setImages(newImages)
    onImagesChange?.(newImages)
    dispatch(setInputs({ formName: 'beaconForm', data: { newCollage: newImages } }))
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)
    const remainingSlots = maxImages - images?.length
    const filesToAdd = newFiles.slice(0, remainingSlots)

    filesToAdd.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files')
        return
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      const imageId = `${Date.now()}-${Math.random()}`

      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [imageId]: 0 }))

      reader.onload = (e) => {
        const url = e.target?.result as string
        const newImage: CollageImage = {
          id: imageId,
          url,
          file,
          name: file.name
        }

        // Simulate upload completion
        setTimeout(() => {
          setUploadProgress((prev) => ({ ...prev, [imageId]: 100 }))
          setTimeout(() => {
            setUploadProgress((prev) => {
              const { [imageId]: _, ...rest } = prev
              return rest
            })
          }, 500)
        }, 1000)

        handleImagesUpdate([...images, newImage])
      }

      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (image: any) => {
    const updatedImages = images?.filter((img) => img.fileUrl !== image.fileUrl)
    const imagesToDelete = []
    imagesToDelete.push(image)
    handleImagesUpdate(updatedImages)
    dispatch(setInputs({ formName: 'beaconForm', data: { imagesToDelete, newCollage: updatedImages } }))
  }

  const openFileDialog = () => {
    if (!disabled && images?.length < maxImages) {
      fileInputRef.current?.click()
    }
  }

  // Create array of 9 slots for the grid
  const gridSlots = Array.from({ length: maxImages }, (_, index) => {
    const image = images?.[index]
    const isUploading = image && uploadProgress?.[image?.id] !== undefined
    const progress = image ? uploadProgress?.[image?.id] : 0

    return (
      <motion.div
        key={image?.id || `empty-${index}`}
        className={`
          aspect-square rounded-xl border-2 border-dashed relative overflow-hidden
          ${image ? 'border-cyan-500/30 bg-gray-800' : 'border-gray-600 bg-gray-800/30'}
          ${
            !disabled && !image && images?.length < maxImages
              ? 'hover:border-cyan-500/50 hover:bg-gray-700/50 cursor-pointer transition-all'
              : ''
          }
          ${dragOver && !image && images?.length < maxImages ? 'border-cyan-500 bg-cyan-500/10' : ''}
        `}
        onClick={() => !image && openFileDialog()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={!disabled && !image ? { scale: 1.02 } : {}}
        whileTap={!disabled && !image ? { scale: 0.98 } : {}}
        layout
      >
        {image ? (
          <>
            {/* Image */}
            <Picture
              priority={true}
              src={image?.fileUrl || image?.url}
              alt={image.name}
              className="w-full h-full object-cover"
            />

            {/* Upload Progress */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-sm">{progress}%</div>
                </div>
              </div>
            )}

            {/* Remove Button */}
            {!disabled && !isUploading && (
              <motion.button
                className="absolute top-2 z-20 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(image)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <X className="w-3 h-3" />
              </motion.button>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all opacity-0 hover:opacity-100 flex items-center justify-center">
              <div className="text-white text-xs text-center px-2">
                <FileImage className="w-4 h-4 mx-auto mb-1" />
                {image.name}
              </div>
            </div>
          </>
        ) : (
          /* Empty Slot */
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {images?.length < maxImages && !disabled ? (
              <>
                <Plus className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs text-center">Add Image</span>
              </>
            ) : (
              <div className="w-8 h-8 mb-2 opacity-20">
                <FileImage className="w-full h-full" />
              </div>
            )}
          </div>
        )}
      </motion.div>
    )
  })

  return (
    <div className="mt-8 pb-10 border-b border-gray-700/50">
      {/* Header */}

      <label className="flex items-center space-x-3 text-sm font-medium text-gray-300 mb-6">
        <h3 className="text-lg font-semibold text-white">Photo Collage</h3>
        <span className="text-xs text-gray-500">
          ({images?.length}/{maxImages})
        </span>
      </label>

      {isEditing ? (
        <>
          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">{gridSlots}</AnimatePresence>
          </div>

          {/* Upload Instructions */}
          {images?.length === 0 && !disabled && (
            <div className="text-center py-8 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm mb-2">Upload up to {maxImages} images to create your collage</p>
              <p className="text-xs">Drag & drop images here or click to browse</p>
              <p className="text-xs mt-1">Supported formats: JPG, PNG, GIF (Max 5MB each)</p>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />

          {/* Upload Tips */}
          {images?.length > 0 && images?.length < maxImages && !disabled && (
            <div className="text-xs text-gray-500 bg-gray-800/30 rounded-lg p-3">
              <strong>Tips:</strong> Drag & drop more images, or click the empty slots to add photos. You can upload{' '}
              {maxImages - images?.length} more image{maxImages - images?.length !== 1 ? 's' : ''}.
            </div>
          )}
        </>
      ) : (
        <>
          {images?.length > 0 ? (
            /* Display only - 3x3 Grid */
            <div className="grid grid-cols-3 gap-3">
              {images?.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl border border-gray-700/30 bg-gray-800 overflow-hidden"
                >
                  <Picture
                    priority={true}
                    src={image?.fileUrl || image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Fill remaining empty slots for visual consistency */}
              {Array.from({ length: maxImages - images?.length }, (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-square rounded-xl border border-dashed border-gray-700/20 bg-gray-800/20 opacity-30"
                />
              ))}
            </div>
          ) : (
            /* Empty State - Not Editing */
            <div className="text-center py-6 text-gray-500 bg-gray-800/20 border border-gray-700/30 rounded-lg">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm mb-1">No photos added yet</p>
              <p className="text-xs text-gray-500">Enable editing to create your photo collage</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Collage
