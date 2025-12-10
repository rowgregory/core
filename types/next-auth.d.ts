import { DefaultSession } from 'next-auth'
import { AdapterUser as BaseAdapterUser } from '@auth/core/adapters'

declare module 'next-auth' {
  interface User {
    id: string
    role?: string
    isAdmin?: boolean
    isSuperUser?: boolean
    isMembership?: boolean
    membershipStatus?: string
  }

  interface Session {
    user: {
      id: string
      role?: string
      isAdmin?: boolean
      isSuperUser?: boolean
      isMembership
    } & DefaultSession['user']
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends BaseAdapterUser {
    role?: string
    isAdmin?: boolean
    isSuperUser?: boolean
    isMembership
    membershipStatus?: string
    lastLoginAt?: Date
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId?: string
    role?: string
    isAdmin?: boolean
    isSuperUser?: boolean
    isMembership
  }
}
