import { FC } from 'react'
import ActionsButton from '../header/ActionsButton'
import MobileMenuButton from '../header/MobileMenuButton'
import LogoutButton from '../header/LogoutButton'
import BeaconActions from '../beacon/BeaconActions'
import { useApplicationSelector } from '@/app/lib/redux/store'
import ActionDropdown from '../ActionDropdown'

interface IFixedHeader {
  selectedPage: string
  links: { id: string; label: string; description: string }[]
}

const FixedHeader: FC<IFixedHeader> = ({ selectedPage, links }) => {
  const { isNavigationCollapsed } = useApplicationSelector()
  const getPageDisplayName = (page: string) => {
    const item = links?.find((nav: { id: string }) => nav.id === page)
    return item?.label || page
  }
  const getPageDisplayDescription = (page: string) => {
    const item = links?.find((nav: { id: string }) => nav.id === page)
    return item?.description
  }

  return (
    <>
      <ActionDropdown />
      <header
        className={`${isNavigationCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'} fixed left-0 top-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-30 h-[69px]`}
        style={{
          transition: 'left 0.3s ease-in-out'
        }}
      >
        <div className="h-full px-3 sm:px-6 flex items-center justify-end sm:justify-between">
          {/* Header Left */}
          <div className="hidden sm:flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                {getPageDisplayName(selectedPage)}
              </h1>
              <p className="text-gray-400 text-sm hidden md:block">
                {selectedPage === 'bridge'
                  ? 'Complete chapter management and analytics'
                  : `Currently viewing: ${getPageDisplayDescription(selectedPage)}`}
              </p>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center space-x-4">
            {/* Actions Dropdown */}
            {selectedPage === 'beacon' && <BeaconActions />}
            <MobileMenuButton />
            <ActionsButton />
            <LogoutButton />
          </div>
        </div>
      </header>
    </>
  )
}

export default FixedHeader
