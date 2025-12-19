import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
  isRequired?: boolean
  variant?: 'default' | 'filled' | 'outlined'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      icon,
      helperText,
      isRequired = false,
      variant = 'default',
      className = '',
      disabled = false,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const paddingLeft = icon ? 'pl-10 pt-3' : 'p-4'

    const textareaStyles = `w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
      variant === 'default'
        ? 'bg-gray-800/50 border border-gray-600 rounded-lg'
        : variant === 'filled'
          ? 'bg-gray-700/50 border-0 rounded-lg'
          : 'bg-transparent border-2 border-gray-600 rounded-lg'
    } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : ''} ${disabled ? 'bg-gray-800/30' : ''}`

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {isRequired && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}

          <textarea
            ref={ref}
            rows={rows}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${textareaStyles} ${paddingLeft} ${className}`}
            {...props}
          />

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
)

Textarea.displayName = 'Textarea'
