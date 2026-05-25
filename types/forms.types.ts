import { User } from './user.types'

export interface IForm {
  inputs: any
  handleInput: any
  handleSubmit: any
  isLoading: boolean
  errors?: any
  onClose?: () => void
  handleToggle?: any
  uploadingVideo?: boolean
  isUpdating?: boolean
  user?: any | null
  users?: User[] | null | undefined
  ref?: any
}
