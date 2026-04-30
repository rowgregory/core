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
    signedInWith?: 'email' | 'secondaryEmail'
  }

  interface Session {
    user: {
      id: string
      role?: string
      isAdmin?: boolean
      isSuperUser?: boolean
      isMembership?: boolean
      signedInWith?: 'email' | 'secondaryEmail'
    } & DefaultSession['user']
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends BaseAdapterUser {
    role?: string
    isAdmin?: boolean
    isSuperUser?: boolean
    isMembership?: boolean
    membershipStatus?: string
    lastLoginAt?: Date
    signedInWith?: 'email' | 'secondaryEmail'
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId?: string
    role?: string
    isAdmin?: boolean
    isSuperUser?: boolean
    isMembership?: boolean
    signedInWith?: 'email' | 'secondaryEmail'
  }
}
