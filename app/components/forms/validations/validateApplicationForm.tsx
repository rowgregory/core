import isValidEmail from '@/app/regex/isValidEmail'

interface ApplicationFormInputs {
  name: string
  email: string
  company: string
  industry: string
  location: string
  phone: string
  businessLicenseNumber: string
}

const validateApplicationForm = (inputs: ApplicationFormInputs, setErrors: (newErrors: any) => void) => {
  const newErrors: any = {}

  if (!inputs?.name?.trim()) {
    newErrors.name = 'Please enter valid name'
  }

  if (!isValidEmail(inputs?.email)) {
    newErrors.email = 'Please enter valid email'
  }

  if (!inputs?.company?.trim()) {
    newErrors.company = 'Please enter valid company'
  }

  if (!inputs?.location?.trim()) {
    newErrors.location = 'Please enter valid location'
  }

  if (!inputs?.industry?.trim()) {
    newErrors.industry = 'Please enter valid industry'
  }

  if (!inputs?.phone?.trim() || inputs.phone.replace(/\D/g, '').length < 10) {
    newErrors.phone = 'Please enter a valid 10-digit phone number'
  }

  if (!inputs?.businessLicenseNumber?.trim()) {
    newErrors.businessLicenseNumber = 'Please enter valid businees license number'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export const isApplicationFormValid = (inputs: any) => {
  return inputs?.name && inputs?.email && inputs?.company && inputs?.industry
}

export default validateApplicationForm
