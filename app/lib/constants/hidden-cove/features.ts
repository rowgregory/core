import CrewQuartersSVG from '@/public/svg/CrewQuartersSVG'
import TreasureVaultSVG from '@/public/svg/TreasureVaultSVG'
import { Beer } from 'lucide-react'

export const features = [
  {
    id: 'tavern',
    name: 'The Tavern',
    tagline: 'Grogs',
    description:
      'Manage group grogs with ease. From invitations to follow-ups, everything is organized so the crew can focus on building real connections.',
    icon: Beer,
    gradient: 'from-yellow-600 via-amber-600 to-orange-600',
    accentColor: 'yellow-500',
    capabilities: [
      { title: 'Grog Management', desc: 'Create and manage events tailored to your group' },
      { title: 'Attendance Tracking', desc: 'See exactly who showed up and participated' },
      { title: 'Custom Grog Types', desc: 'Run anything from casual meetups to formal gatherings' }
    ],
    status: 'not_purchased',
    linkKey: '/admin/grogs',
    pricing: {
      build: 950,
      monthly: 30
    }
  },

  {
    id: 'quarters',
    name: 'The Crew Quarters',
    tagline: 'Muster',
    description:
      'Keep your membership organized and engaged. Track attendance, maintain profiles, and ensure no crew member slips through the cracks.',
    icon: CrewQuartersSVG,
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
    accentColor: 'purple-500',
    capabilities: [
      {
        title: 'Fleet Overview',
        desc: 'View your entire crew at a glance with attendance stats, engagement trends, and group health insights.'
      },
      {
        title: 'Crew Records',
        desc: 'Keep detailed profiles for each member, track participation history, and manage follow-ups with ease.'
      },
      {
        title: 'Daily Muster',
        desc: 'Log attendance for each meeting in real time, ensuring accurate records and smooth roll calls.'
      }
    ],
    status: 'not_purchased',
    linkKey: '/admin/muster',
    pricing: {
      build: 2450,
      monthly: 45
    }
  },
  {
    id: 'vault',
    name: 'The Treasure Chest',
    tagline: 'Booty',
    description:
      'All your financial booty in one secure place. Process payments, handle billing, and review clear reports so your crew always knows where your booty stands.',
    icon: TreasureVaultSVG,
    gradient: 'from-teal-600 via-emerald-600 to-green-600',
    accentColor: 'green-500',
    capabilities: [
      { title: 'Payment Processing', desc: 'Easily collect dues, fees, or donations' },
      { title: 'Financial Reporting', desc: 'Simple, clear breakdowns of income and expenses' },
      { title: 'Compliance Tools', desc: 'Export-ready data for taxes and record-keeping' }
    ],
    status: 'not_purchased',
    linkKey: '/admin/booty',
    pricing: {
      build: 4500,
      monthly: 70
    }
  }
]
