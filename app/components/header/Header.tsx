import Link from 'next/link'
import React from 'react'
import LaunchAppButton from '../common/LaunchAppButton'
import useCustomPathname from '@/hooks/useCustomPathname'
import { Menu, ShipWheel } from 'lucide-react'
import { useAppDispatch, useSettingsSelector } from '@/app/lib/redux/store'
import { setOpenNavigationDrawer } from '@/app/lib/redux/features/appSlice'

const Header = () => {
  const path = useCustomPathname()
  const { settings } = useSettingsSelector()
  const dispatch = useAppDispatch()

  return (
    <div
      className={`${path === '/' ? 'bg-transparent' : 'bg-slate-900'} flex items-center justify-between space-x-4 py-3 px-6 h-[74px] relative z-20`}
    >
      <Link
        href="/"
        className="bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent uppercase text-2xl font-bold cursor-pointer hover:bg-linear-to-r hover:from-teal-400 hover:via-blue-400 hover:to-cyan-400 flex items-center"
      >
        C
        <span>
          <ShipWheel className="text-white w-5 h-5 shipwheel-storm" />
        </span>
        RE
      </Link>
      <div className="absolute left-1/2 -translate-x-1/2 space-x-4 hidden md:block">
        <Link
          href="/"
          className={`${path === '/' ? 'bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent' : 'text-white'} hover:bg-linear-to-r hover:from-cyan-400 hover:via-blue-400 hover:to-teal-400 hover:bg-clip-text hover:text-transparent hover:duration-300 text-[15px] uppercase font-sora font-bold`}
        >
          Home
        </Link>
        <Link
          href="/swabbie"
          className={`${path === '/swabbie' ? 'bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent' : 'text-white'} hover:bg-linear-to-r hover:from-cyan-400 hover:via-blue-400 hover:to-teal-400 hover:bg-clip-text hover:text-transparent hover:duration-300 text-[15px] uppercase font-sora font-bold`}
        >
          Application
        </Link>
        <Link
          href="/navigators"
          className={`${path.includes('navigators') ? 'bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent' : 'text-white'} hover:bg-linear-to-r hover:from-cyan-400 hover:via-blue-400 hover:to-teal-400 hover:bg-clip-text hover:text-transparent hover:duration-300 text-[15px] uppercase font-sora font-bold`}
        >
          Navigators
        </Link>
        {settings?.hasUnlockedGrog && (
          <Link
            href="/events"
            className={`${path === '/events' ? 'bg-linear-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent' : 'text-white'} hover:bg-linear-to-r hover:from-cyan-400 hover:via-blue-400 hover:to-teal-400 hover:bg-clip-text hover:text-transparent hover:duration-300 text-[15px] uppercase font-sora font-bold`}
          >
            Events
          </Link>
        )}
      </div>
      <div className="flex items-center gap-x-6">
        <Menu onClick={() => dispatch(setOpenNavigationDrawer())} className="w-5 h-5 block md:hidden text-white" />
        {path !== '/auth/login' && <LaunchAppButton />}
      </div>
    </div>
  )
}

export default Header
