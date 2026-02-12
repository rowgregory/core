'use server'

import AdminLayoutClient from '../components/pages/AdminLayoutClient'

export default async function AdminLayoutPage({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
