import { User } from '@prisma/client'
import { ReactNode } from 'react'

export interface ILayoutClient {
  data: any
  children: ReactNode
}

export interface PageWrapperProps {
  children: ReactNode
  users: any
}
