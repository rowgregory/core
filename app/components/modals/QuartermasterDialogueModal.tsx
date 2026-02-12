'use client'

import { useState, useEffect, FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { User as UserProps } from '@/types/user'
import Picture from '../common/Picture'
import { useAppDispatch, useFormSelector } from '@/app/lib/redux/store'
import { createFormActions, setInputs } from '@/app/lib/redux/features/formSlice'
import getDialogue from '@/app/lib/utils/port/getDialog'
import MainDialog from '../port/MainDialog'
import PortLedger from '../port/PortLedger'

interface IQuartermasterDialogModal {
  user: UserProps
  onClose: () => void
  open: boolean
}

const QuartermasterDialogueModal: FC<IQuartermasterDialogModal> = ({ user, onClose, open }) => {
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showPortLedger, setShowPortLedger] = useState(false)
  const [showSignalTheQuartermaster, setShowSignalTheQuartermaster] = useState(false)
  const [showShipPapers, setShowShipPapers] = useState(false)
  const [showScuttleThePapersWarning, setShowScuttleThePapersWarning] = useState(false)
  const [messageText, setMessageText] = useState('')
  const { swabbieForm } = useFormSelector()
  const dispatch = useAppDispatch()
  const { handleInput, handleToggle } = createFormActions('swabbieForm', dispatch)
  const inputs = swabbieForm?.inputs

  const dialogues = getDialogue(user)
  const currentMsg = dialogues[currentDialogue]

  useEffect(() => {
    if (!open) return

    const dialogues = getDialogue(user)
    const dialogue = dialogues[currentDialogue]

    if (!dialogue) return

    const text = dialogue.text
    setDisplayedText('')
    setIsTyping(true)

    let i = 0
    let typingText = ''

    const timer = setInterval(() => {
      if (i < text.length) {
        typingText += text.charAt(i)
        setDisplayedText(typingText)
        i++
      } else {
        setIsTyping(false)
        clearInterval(timer)

        if (currentDialogue === 0) {
          setTimeout(() => {
            setShowPortLedger(true)
          }, 800) // Small delay after typing finishes
        }
      }
    }, 50)

    return () => {
      clearInterval(timer)
      setIsTyping(false)
    }
  }, [currentDialogue, open, user])

  const handlePortLedgeSelect = (option: string) => {
    if (option === 'message') {
      setShowSignalTheQuartermaster(true)
      setShowPortLedger(false)
    } else if (option === 'ship-papers') {
      dispatch(setInputs({ formName: 'swabbieForm', data: user }))
      setShowShipPapers(true)
      setShowPortLedger(false)
    } else if (option === 'scuttle-the-papers') {
      setShowScuttleThePapersWarning(true)
    }
  }

  const handleCancelSignalToQuartermaster = () => {
    setShowSignalTheQuartermaster(false)
    setShowPortLedger(true)
    setMessageText('')
  }

  const handleCancelUpdatePapers = () => {
    setShowShipPapers(false)
    setShowPortLedger(true)
  }

  const handleCloseModal = () => {
    setShowPortLedger(false)
    setDisplayedText('')
    setIsTyping(false)
    setCurrentDialogue(0)
    onClose()
  }

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-80 overflow-hidden"
        >
          {/* Floating Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-6 flex items-center space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-amber-500/30"
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-amber-300 text-sm font-medium">Message from the Deep</span>
          </motion.div>

          {/* Floating Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleCloseModal}
            className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full border border-slate-600/30 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-400/50 transition-all z-10"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* Character - Floating on the right */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
            className="absolute right-0 bottom-0 w-md h-full flex flex-col justify-end"
          >
            <Picture
              src="/images/q-1.png"
              alt="Quartermaster"
              className="w-full h-auto object-contain"
              priority={true}
            />
          </motion.div>

          {/* Floating Character Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-20 right-6 bg-black/30 backdrop-blur-lg rounded-2xl px-4 py-3 border border-amber-500/20"
          >
            <h3 className="text-amber-300 font-semibold text-lg">{currentMsg?.speaker}</h3>
            <p className="text-slate-400 text-sm">Port Authority</p>
          </motion.div>

          <MainDialog
            currentDialogue={currentDialogue}
            currentMsg={currentMsg}
            dialogues={dialogues}
            displayedText={displayedText}
            isTyping={isTyping}
          />

          {showPortLedger && (
            <PortLedger
              handleOptionSelect={handlePortLedgeSelect}
              showScuttleThePapersWarning={showScuttleThePapersWarning}
              setShowScuttleThePapersWarning={setShowScuttleThePapersWarning}
              isActive={user?.membershipStatus === 'ACTIVE'}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default QuartermasterDialogueModal
