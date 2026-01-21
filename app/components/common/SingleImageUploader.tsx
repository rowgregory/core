import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Camera, FileImage } from 'lucide-react'
import Picture from './Picture'
import { setInputs } from '@/app/lib/redux/features/formSlice'
import { useAppDispatch } from '@/app/lib/redux/store'

interface SingleImageUploaderProps {
  label?: string
  inputs: any
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  isEditing: boolean
  coverImageName?: string
  coverImageFilenameName?: string
  placeholder?: string
}

const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  label = 'Cover Image',
  inputs,
  handleInput,
  isEditing,
  coverImageName = 'coverImage',
  coverImageFilenameName = 'coverImageFilename',
  placeholder = 'Upload your cover image'
}) => {
  const dispatch = useAppDispatch()
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentImage = inputs[coverImageName]
  const currentFilename = inputs[coverImageFilenameName]

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()

    dispatch(setInputs({ formName: 'beaconForm', data: { coverImageFile: file } }))

    // Simulate upload progress
    setUploadProgress(0)

    reader.onload = (e) => {
      const url = e.target?.result as string

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null) return 0
          if (prev >= 100) {
            clearInterval(progressInterval)
            setTimeout(() => setUploadProgress(null), 500)
            return 100
          }
          return prev + 10
        })
      }, 100)

      // Update the form inputs
      const imageEvent = {
        target: {
          name: coverImageName,
          value: url
        }
      } as React.ChangeEvent<HTMLInputElement>

      const filenameEvent = {
        target: {
          name: coverImageFilenameName,
          value: file.name
        }
      } as React.ChangeEvent<HTMLInputElement>

      handleInput(imageEvent)
      handleInput(filenameEvent)
    }

    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (isEditing) setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (isEditing) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeImage = () => {
    const imageEvent = {
      target: {
        name: coverImageName,
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>

    const filenameEvent = {
      target: {
        name: coverImageFilenameName,
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>

    handleInput(imageEvent)
    handleInput(filenameEvent)
  }

  const openFileDialog = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="flex items-center space-x-3 text-sm font-medium text-gray-300">
        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
          <Camera className="w-4 h-4 text-cyan-400" />
        </div>
        <span>{label}</span>
      </label>

      {/* Image Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl overflow-hidden transition-all
          ${
            dragOver && isEditing
              ? 'border-cyan-500 bg-cyan-500/10'
              : currentImage
                ? 'border-cyan-500/30'
                : 'border-gray-600'
          }
          ${isEditing && !currentImage ? 'hover:border-cyan-500/50 hover:bg-gray-700/30 cursor-pointer' : ''}
        `}
        onClick={!currentImage ? openFileDialog : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentImage ? (
          /* Current Image Display */
          <div className="relative group">
            <Picture
              priority={true}
              src={currentImage}
              alt={currentFilename || 'Cover image'}
              className="w-full h-48 object-cover"
            />

            {/* Upload Progress Overlay */}
            {uploadProgress !== null && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-sm">{uploadProgress}%</div>
                </div>
              </div>
            )}

            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="text-white text-sm truncate">{currentFilename || 'Uploaded image'}</div>
            </div>

            {/* Remove Button */}
            {isEditing && uploadProgress === null && (
              <motion.button
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}

            {/* Replace Button */}
            {isEditing && uploadProgress === null && (
              <motion.button
                className="absolute top-2 left-2 px-3 py-1 bg-black/70 hover:bg-black/80 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1"
                onClick={(e) => {
                  e.stopPropagation()
                  openFileDialog()
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Upload className="w-3 h-3" />
                <span>Replace</span>
              </motion.button>
            )}
          </div>
        ) : (
          /* Upload Area */
          <div
            className={`flex flex-col items-center justify-center h-48 text-center px-6 ${!isEditing ? 'opacity-50' : ''}`}
          >
            {isEditing ? (
              <>
                <Camera className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-300 mb-1">{placeholder}</p>
                <p className="text-xs text-gray-500">Drag & drop an image here or click to browse</p>
                <p className="text-xs text-gray-600 mt-2">Supported: JPG, PNG, GIF (Max 5MB)</p>
              </>
            ) : (
              <>
                <FileImage className="w-12 h-12 text-gray-500 mb-3 opacity-30" />
                <p className="text-sm text-gray-400">No cover image uploaded</p>
                <p className="text-xs text-gray-500">Enable editing to upload an image</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={!isEditing}
      />
    </div>
  )
}

export default SingleImageUploader
