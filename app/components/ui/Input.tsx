import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import getInputStyles from '@/app/lib/utils/ui/getInputStyles'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
  isRequired?: boolean
  showPasswordToggle?: boolean
  variant?: 'default' | 'filled' | 'outlined'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      helperText,
      isRequired = false,
      showPasswordToggle = false,
      variant = 'default',
      className = 'focus:outline-none',
      type = 'text',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type
    const paddingLeft = icon ? 'pl-10' : 'pl-4'
    const paddingRight = showPasswordToggle ? 'pr-10' : 'pr-4'

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {isRequired && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${getInputStyles(variant, !!error, disabled)} ${paddingLeft} ${paddingRight} ${className}`}
            {...props}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={disabled}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

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

Input.displayName = 'Input'
