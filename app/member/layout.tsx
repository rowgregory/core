import MemberLayoutClient from '../components/pages/MemberLayoutClient'

export const dynamic = 'force-dynamic'

export default async function MemberLayoutPage({ children }) {
  return <MemberLayoutClient>{children}</MemberLayoutClient>
}
