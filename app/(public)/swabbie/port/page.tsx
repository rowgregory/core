'use client'

import React, { Suspense } from 'react'
import SwabbiePort from './SwabbiePort'

const SwabbiePortPage = () => {
  return (
    <Suspense fallback={<></>}>
      <SwabbiePort />
    </Suspense>
  )
}

export default SwabbiePortPage
