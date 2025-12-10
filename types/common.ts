import { ReactNode } from 'react'
import { User } from './user'

export interface ILayoutClient {
  data: any
  children: ReactNode
}

export interface PageWrapperProps {
  children: ReactNode
  users: User[]
}
