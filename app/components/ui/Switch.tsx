import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface SwitchProps {
  name?: string
  checked: boolean
  onChange: (e: { target: { name: string; checked: boolean } }) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ name, checked, onChange, label, description, disabled = false, size = 'md' }, ref) => {
    const sizeClasses = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4'
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5'
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7'
      }
    }

    const { track, thumb, translate } = sizeClasses[size]

    return (
      <div className="flex items-start space-x-3">
        {/* Hidden input for form handling */}
        <input
          ref={ref}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => !disabled && onChange({ target: { name: name || '', checked: !checked } })}
          disabled={disabled}
          className={`
          relative inline-flex items-center ${track} rounded-full transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${checked ? 'bg-linear-to-r from-cyan-600 via-blue-600 to-teal-600 shadow-lg' : 'bg-gray-600 hover:bg-gray-500'}
        `}
          style={checked ? { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' } : {}}
        >
          <span className="sr-only">{label}</span>

          {/* Thumb */}
          <motion.span
            layout
            className={`
            ${thumb} bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out
            flex items-center justify-center
            ${checked ? translate : 'translate-x-0.5'}
          `}
            whileHover={!disabled ? { scale: 1.1 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            {/* Optional check/x icons */}
            {checked ? (
              <svg className="w-3 h-3 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </motion.span>

          {/* Glow effect when on */}
          {checked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-600 to-teal-600 blur-md opacity-50 -z-10"
            />
          )}
        </button>

        {/* Label and Description */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                className={`block text-sm font-medium text-gray-300 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
                onClick={() => !disabled && onChange({ target: { name: name || '', checked: !checked } })}
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'
