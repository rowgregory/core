'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import PageWrapper from './page-wrapper'

interface ReduxWrapperProps {
  children: React.ReactNode
}

export default function ReduxWrapper({ children }: ReduxWrapperProps) {
  return (
    <Provider store={store}>
      <PageWrapper>{children}</PageWrapper>
    </Provider>
  )
}
