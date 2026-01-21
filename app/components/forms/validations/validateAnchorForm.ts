import { Errors } from '@/app/lib/redux/features/formSlice'

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validation
const validateAnchorForm = (
  inputs: {
    giverId: any
    externalGiverName: string
    receiverId: any
    externalReceiverName: string
    externalGiverEmail: any
    externalReceiverEmail: any
    businessValue: string
    description: string
    closedDate: any
  },
  setErrors: { (errors: Errors): any; (arg0: any): void }
) => {
  const newErrors: any = {}

  // Derive external state for validation
  const isExternalGiver = !inputs?.giverId && !!inputs?.externalGiverName
  const isExternalReceiver = !inputs?.receiverId && !!inputs?.externalReceiverName

  // Giver validation
  if (isExternalGiver) {
    if (!inputs?.externalGiverName?.trim()) {
      newErrors.externalGiverName = 'External giver name is required'
    }
    if (inputs?.externalGiverEmail && !isValidEmail(inputs?.externalGiverEmail)) {
      newErrors.externalGiverEmail = 'Please enter a valid email address'
    }
  } else {
    if (!inputs?.giverId) {
      newErrors.giverId = 'Please select who gave you the referral'
    }
  }

  // Receiver validation
  if (isExternalReceiver) {
    if (!inputs?.externalReceiverName?.trim()) {
      newErrors.externalReceiverName = 'External receiver name is required'
    }
    if (inputs?.externalReceiverEmail && !isValidEmail(inputs?.externalReceiverEmail)) {
      newErrors.externalReceiverEmail = 'Please enter a valid email address'
    }
  } else {
    if (!inputs?.receiverId) {
      newErrors.receiverId = 'Please select who should receive recognition'
    }
  }

  // Ensure at least one participant is internal
  if (isExternalGiver && isExternalReceiver) {
    newErrors.general = 'At least one participant must be a registered member'
  }

  // Other existing validations...
  if (!inputs?.businessValue || parseFloat(inputs?.businessValue) <= 0) {
    newErrors.businessValue = 'Business value must be greater than 0'
  }

  if (!inputs?.description?.trim()) {
    newErrors.description = 'Description is required'
  }

  if (!inputs?.closedDate) {
    newErrors.closedDate = 'Closed date is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateAnchorForm
