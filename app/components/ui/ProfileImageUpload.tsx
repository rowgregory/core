import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, X, ImagePlus } from 'lucide-react'
import Picture from '../common/Picture'

interface ProfileImageUploadProps {
  label?: string
  error?: string
  helperText?: string
  isRequired?: boolean
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  label,
  error,
  helperText,
  isRequired = false,
  disabled = false,
  value = '',
  onChange,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImage(base64String)
        onChange?.(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = () => {
    setPreviewImage(null)
    onChange?.('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleTriggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getInputStyles = () => {
    const baseStyles = 'w-full rounded-lg border transition-all duration-200 '

    if (disabled) {
      return baseStyles + 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
    }

    if (error) {
      return baseStyles + 'border-red-400 bg-red-950/20 text-red-300 focus:outline-none'
    }

    return (
      baseStyles +
      `
      bg-gray-800 
      border-gray-700 
      text-white 
      hover:border-violet-400 
      focus:border-violet-500 
      focus:outline-none 
      focus:ring-2 
      focus:ring-violet-400/50
    `
    )
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {isRequired && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div
          className={`
            ${getInputStyles()} 
            h-40 
            flex 
            items-center 
            justify-center 
            cursor-pointer 
            group 
            relative 
            overflow-hidden
          `}
          onClick={handleTriggerFileInput}
        >
          {previewImage || value ? (
            <>
              <Picture
                src={previewImage || value}
                alt="Profile"
                className="w-full h-full object-cover"
                priority={false}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className="
                  absolute 
                  top-2 
                  right-2 
                  bg-red-500/80 
                  text-white 
                  p-1 
                  rounded-full 
                  hover:bg-red-600 
                  transition-colors
                "
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-gray-400 group-hover:text-violet-400 transition-colors">
              <ImagePlus className="w-12 h-12 mb-2" />
              <span>Upload Profile Photo</span>
            </div>
          )}
        </div>

        {/* Focus ring animation */}
        {isFocused && !error && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-violet-400/50 pointer-events-none"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-1 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
}
