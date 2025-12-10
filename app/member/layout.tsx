'use server'

import React, { FC, ReactNode } from 'react'
import { getMemberOverview } from '../actions/getMemberOverview'
import MemberLayoutClient from './page'

const MemberLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const data = await getMemberOverview()

  return <MemberLayoutClient data={data}>{children}</MemberLayoutClient>
}

export default MemberLayout
