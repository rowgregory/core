import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import getInputStyles from '@/app/lib/utils/ui/getInputStyles'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  icon?: React.ReactNode | any
  helperText?: string
  isRequired?: boolean
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
  variant?: 'default' | 'filled' | 'outlined'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      icon,
      helperText,
      isRequired = false,
      options = [],
      placeholder,
      variant = 'default',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const paddingLeft = icon ? 'pl-10' : 'pl-4'

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {isRequired && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">{icon}</div>}

          <select
            ref={ref}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${getInputStyles(variant, !!error, disabled)} ${paddingLeft} pr-8 ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-gray-800 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

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

Select.displayName = 'Select'
