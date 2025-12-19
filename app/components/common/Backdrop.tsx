import { FC, useEffect } from 'react'
import { motion } from 'framer-motion'

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
}

const Backdrop: FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    // Prevent background scroll
    document.body.style.overflow = 'hidden'
    return () => {
      // Re-enable scroll when unmounted
      document.body.style.overflow = ''
    }
  }, [])
  return (
    <motion.div
      variants={overlayVariants}
      initial="closed"
      animate="open"
      exit="closed"
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
    />
  )
}

export default Backdrop
