import { motion } from 'framer-motion'

const HorizontalLoader = () => {
  return (
    <div className="w-12 h-1 bg-gray-900 rounded-full overflow-hidden relative">
      <motion.div
        className="h-1 w-5 bg-linear-to-r from-teal-500 via-blue-500 to-cyan-500 rounded-full absolute"
        animate={{ x: [0, 28, 0] }} // move right then back
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

export default HorizontalLoader
