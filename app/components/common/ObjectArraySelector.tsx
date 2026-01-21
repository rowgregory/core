import { setInputs } from '@/app/lib/redux/features/formSlice'
import { motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { cloneElement, FC, useState } from 'react'

interface IObjectArraySelector {
  inputs: any
  label: string
  icon: any
  name: string
  items: any
  fields: any
  disabled: boolean
  dispatch: any
}

const ObjectArraySelector: FC<IObjectArraySelector> = ({
  inputs,
  label,
  icon,
  name,
  items,
  fields,
  disabled = false,
  dispatch
}) => {
  // Local state for the form inputs
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleFormInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleObjectArrayInput = (name: string, value: any) => {
    // This should update the main inputs (Redux), not formData
    dispatch(
      setInputs({
        formName: 'beaconForm',
        data: {
          [name]: [...(inputs?.[name] || []), value]
        }
      })
    )
    setFormData({})
  }

  const removeObjectArrayItem = (name: string, index: number) => {
    // This should also use inputs, not formData
    dispatch(
      setInputs({
        formName: 'beaconForm',
        data: {
          [name]: (inputs?.[name] || []).filter((_: any, i: number) => i !== index)
        }
      })
    )
  }

  // Handle adding a new item
  const handleAddItem = () => {
    // Check if all fields are filled
    const isValid = fields.every((field: any) => formData[field.name]?.trim())

    if (isValid) {
      handleObjectArrayInput(name, { ...formData })
      dispatch(setInputs({ formName: 'beaconForm', data: {} }))
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center space-x-3 text-sm font-medium text-gray-300">
        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
          {cloneElement(icon, { className: 'w-4 h-4 text-cyan-400' })}
        </div>
        <span>{label}</span>
      </label>

      {/* Display existing items */}
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3 flex items-start justify-between"
            >
              <div className="flex-1 min-w-0">
                {fields.map((field: any) => (
                  <div key={field.name} className="text-sm">
                    <span className="text-cyan-300 font-medium">{field.label}: </span>
                    <span className="text-white">{item[field.name]}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => removeObjectArrayItem(name, index)}
                className="text-cyan-300 hover:text-white ml-2 shrink-0"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-6 text-gray-500 bg-gray-800/20 border border-gray-700/30 rounded-lg">
          <div className="text-sm mb-1">No {label.toLowerCase()} added yet</div>
          <div className="text-xs">Use the form below to add your first {label.replace(/s$/, '').toLowerCase()}</div>
        </div>
      )}

      {/* Add new item form */}
      {!disabled && (
        <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
          <div className="space-y-3">
            {fields.map((field: any) => (
              <div key={field.name}>
                <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormInputChange(field.name, e.target.value)} // Not handleInput
                    placeholder={field.placeholder}
                    rows={2}
                    disabled={disabled}
                    className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50"
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormInputChange(field.name, e.target.value)} // Not handleInput
                    placeholder={field.placeholder}
                    disabled={disabled}
                    className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50"
                  />
                )}
              </div>
            ))}

            <motion.button
              type="button"
              onClick={handleAddItem}
              disabled={disabled || !fields.every((field: any) => formData[field.name]?.trim())}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add {label.replace(/s$/, '')}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ObjectArraySelector
