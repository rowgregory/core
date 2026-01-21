'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from './lib/redux/store'
import PageWrapper from './page-wrapper'
import { PageWrapperProps } from '@/types/common'

export default function ReduxWrapper({ children, users }: PageWrapperProps) {
  return (
    <Provider store={store}>
      <PageWrapper users={users}>{children}</PageWrapper>
    </Provider>
  )
}
