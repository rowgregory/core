import { setInputs } from '@/app/lib/redux/features/formSlice'
import { useAppDispatch } from '@/app/lib/redux/store'
import { X } from 'lucide-react'
import { FC } from 'react'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'

interface ITagSelector {
  inputs: any
  label: string
  icon: any
  name: string
  tags: any[]
  isEditing: boolean
}

const TagSelector: FC<ITagSelector> = ({ inputs, label, icon, name, tags, isEditing }) => {
  const dispatch = useAppDispatch()

  const handleArrayInput = (name: string, value: any) => {
    dispatch(
      setInputs({
        formName: 'beaconForm',
        data: {
          [name]: [...inputs?.[name], value]
        }
      })
    )
  }

  const removeArrayItem = (name: string, index: number) => {
    dispatch(
      setInputs({
        formName: 'beaconForm',
        data: {
          [name]: inputs?.[name]?.filter?.((_: any, i: number) => i !== index)
        }
      })
    )
  }
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-3 text-sm font-medium text-gray-300">
        <div className="p-1.5 bg-cyan-500/10 rounded-lg">{icon}</div>
        <span>{label}</span>
      </label>

      {/* Selected tags */}
      {inputs?.[name]?.length > 0 ? (
        <motion.div className="flex flex-wrap gap-2 mb-3" variants={containerVariants} initial="hidden" animate="show">
          {inputs?.[name]?.map?.((tag: any, index: number) => (
            <motion.div
              variants={itemVariants}
              key={index}
              className={`bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm flex items-center ${isEditing ? 'space-x-2' : ''}`}
            >
              <span>{tag}</span>
              {isEditing && (
                <button onClick={() => removeArrayItem(name, index)} className="text-cyan-300 hover:text-white ml-2">
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-3 text-gray-400 text-xs italic bg-gray-800/30 rounded-lg border border-gray-700/30 mb-3">
          No {label.toLowerCase()} selected yet
        </div>
      )}

      {/* Tag suggestions */}
      {isEditing && (
        <div className="flex flex-wrap gap-2">
          {tags
            ?.filter((tag) => !inputs?.[name]?.includes?.(tag))
            ?.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleArrayInput(name, tag)}
                className="bg-gray-800/50 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 px-3 py-1 rounded-full text-sm border border-gray-700 hover:border-cyan-500/50 transition-all"
                disabled={!isEditing}
              >
                {tag}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default TagSelector
