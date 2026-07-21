import { ReactNode } from 'react'
import { SuperSidebar } from './SuperSidebar'

export default function SuperLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden  bg-bg-light dark:bg-bg-dark">
      <SuperSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
