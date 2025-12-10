'use server'

import React, { FC, ReactNode } from 'react'
import AdminLayoutClient from './page'
import { getAdminOverview } from '../actions/getAdminOverview'

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const data = await getAdminOverview()

  return <AdminLayoutClient data={data}>{children}</AdminLayoutClient>
}

export default AdminLayout
