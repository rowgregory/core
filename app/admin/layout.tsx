import React, { FC, ReactNode } from 'react'
import { chapterId } from '../lib/constants/api/chapterId'
import { cookies } from 'next/headers'
import AdminLayoutClient from './admin-layout-client'
import { auth } from '../lib/auth'

const asyncFetch = async (apiPath: string, fetchOptions: any) => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/${chapterId}/${apiPath}`, fetchOptions)

  return response
}

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
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
        isAdmin: session?.user?.isAdmin,
        isSuperUser: session?.user?.isSuperUser
      })
    }
  }

  const adminOverviewResponse = await asyncFetch('overview', fetchOptions)

  if (!adminOverviewResponse.ok) {
    const errorText = await adminOverviewResponse.text()
    console.error('Admin API error:', errorText)
    return <div>Error loading admin overview</div>
  }

  const data = await adminOverviewResponse.json()

  return <AdminLayoutClient data={data}>{children}</AdminLayoutClient>
}

export default AdminLayout
