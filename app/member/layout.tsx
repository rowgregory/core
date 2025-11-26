import React, { FC, ReactNode } from 'react'
import { chapterId } from '../lib/constants/api/chapterId'
import { cookies } from 'next/headers'
import MemberLayoutClient from './member-layout-client'
import { auth } from '../lib/auth'

const asyncFetch = async (apiPath: string, fetchOptions: any) => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/member/${chapterId}/${apiPath}`, fetchOptions)

  return response
}

const MemberLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const cookieStore = await cookies()
  const session = await auth()

  const fetchOptions = {
    cache: 'no-store' as RequestCache,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
      'x-user': JSON.stringify({
        id: session?.user?.id,
        email: session?.user?.email,
        name: session?.user?.name,
        role: session?.user?.role,
        isAdmin: session?.user?.isAdmin
      })
    }
  }

  const memberOverviewResponse = await asyncFetch('overview', fetchOptions)
  if (!memberOverviewResponse.ok) {
    return <div>Error loading member overview stats</div>
  }

  const data = await memberOverviewResponse.json()

  return <MemberLayoutClient data={data}>{children}</MemberLayoutClient>
}

export default MemberLayout
