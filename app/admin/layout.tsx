import AdminLayoutClient from '../components/pages/AdminLayoutClient'

export const dynamic = 'force-dynamic'

export default async function AdminLayoutPage({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
