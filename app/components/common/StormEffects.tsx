'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const StormEffects = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (!isClient) {
      setIsClient(true)
    }
  }, [isClient])

  if (!isClient) return

  return (
    <>
      {/* Storm Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Lightning flashes */}
        <motion.div
          animate={{
            opacity: [0, 0.4, 0, 0.2, 0, 0.6, 0],
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatDelay: 3,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1]
          }}
          className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-blue-300/20 via-cyan-200/10 to-transparent pointer-events-none"
        />

        {/* Rain effect */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-16 bg-linear-to-b from-cyan-200/60 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`
              }}
              animate={{
                y: [0, 800],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: Math.random() * 1.5 + 1,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'linear'
              }}
            />
          ))}
        </div>

        {/* Animated waves at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <motion.div
            animate={{ x: [-100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 w-[200%] h-full bg-linear-to-r from-cyan-900/20 via-slate-700/30 to-cyan-900/20"
            style={{
              clipPath: 'polygon(0 60%, 25% 80%, 50% 60%, 75% 85%, 100% 65%, 100% 100%, 0% 100%)'
            }}
          />
        </div>
      </div>
    </>
  )
}

export default StormEffects
