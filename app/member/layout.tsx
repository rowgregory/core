'use server'

import MemberLayoutClient from '../components/pages/MemberLayoutClient'

export default async function MemberLayoutPage({ children }) {
  return <MemberLayoutClient>{children}</MemberLayoutClient>
}
