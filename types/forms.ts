import { FormEvent } from 'react'
import { User } from './user'

export interface IBeaconForm {
  inputs: any
  errors: any
  handleInput: (inputs: any) => void
  isEditing: boolean
  handleToggle: any
}

export interface INavigatorForm {
  inputs: any
  errors: any
  handleSubmit: (e: FormEvent) => void
  handleInput: (inputs: any) => void
  handleToggle: any
  isLoading: boolean
  isUpdating: boolean
  onClose: () => void
}

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
  user?: User | null
  users?: User[] | null | undefined
  ref?: any
}
