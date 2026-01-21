'use client'

import React, { useMemo, useState } from 'react'
import { useUserSelector } from '@/app/lib/redux/store'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Lightbox from '@/app/components/navigators/Lightbox'
import HeaderCoverPhoto from '@/app/components/navigator-profile/HeaderCoverPhoto'
import ProfileInfo from '@/app/components/navigator-profile/ProfileInfo'
import NavigationTabs from '@/app/components/navigator-profile/NavigationTabs'
import LeftSidebar from '@/app/components/navigator-profile/LeftSidebar'
import MainSection from '@/app/components/navigator-profile/MainSection'
import RightSidebar from '@/app/components/navigator-profile/RightSidebar'

const ProfilePage = () => {
  const { users } = useUserSelector()
  const session = useSession()
  const { push } = useRouter()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const params = useParams()
  const id = params.navigatorId

  // Find the user based on the URL param
  const user = useMemo(() => {
    if (!id) return null
    return users.find((u) => u.id === id) || null
  }, [users, id])

  return (
    <>
      {lightboxOpen && (
        <Lightbox images={user?.collage} initialIndex={selectedIndex} onClose={() => setLightboxOpen(false)} />
      )}

      <div className="min-h-screen bg-slate-900 text-white pb-20">
        {/* Header Cover Photo */}
        <HeaderCoverPhoto user={user} />

        {/* Profile Info */}
        <ProfileInfo user={user} />

        {/* Navigation Tabs */}
        <NavigationTabs push={push} isAdmin={user?.isAdmin || false} userId={session.data?.user?.id || ''} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Professional Goal */}
          {user?.goal && (
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
              <h3 className="font-bold text-lg mb-4">Professional Goal</h3>
              <p className="text-white text-base leading-relaxed">{user.goal}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <LeftSidebar push={push} session={session} user={user} />
            {/* Main Section */}
            <MainSection session={session} user={user} />

            {/* Right Sidebar */}
            <RightSidebar setLightboxOpen={setLightboxOpen} setSelectedIndex={setSelectedIndex} user={user} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
