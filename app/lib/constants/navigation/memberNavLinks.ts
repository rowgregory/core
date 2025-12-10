import HiddenCoveSVG from '@/public/svg/HiddenCoveSVG'
import {
  TowerControl,
  Ship,
  Anchor,
  Scroll,
  Layers,
  Sailboat,
  Crosshair,
  Flag,
  ClipboardList,
  BookOpenText
} from 'lucide-react'

export const memberNavLinks = (isMembership: boolean) => [
  {
    id: 'bridge',
    label: 'Bridge',
    icon: Ship,
    description: 'Dashboard',
    linkKey: '/member/bridge'
  },
  {
    id: 'parley',
    label: 'Parley',
    icon: Scroll,
    description: '1-2-1',
    linkKey: '/member/parley'
  },
  {
    id: 'treasure-maps',
    label: 'Treasure Maps',
    icon: Layers,
    description: 'Referrals',
    linkKey: '/member/treasure-maps'
  },
  {
    id: 'anchors',
    label: 'Anchors',
    icon: Anchor,
    description: 'Thank You For Closed Business',
    linkKey: '/member/anchors'
  },
  {
    id: 'stowaways',
    label: 'Stowaways',
    icon: Flag,
    description: 'The Brig',
    linkKey: '/member/stowaways'
  },
  {
    id: 'rendezvous',
    label: 'Rendezvous',
    icon: Crosshair,
    description: 'The Gathering Point',
    linkKey: '/member/rendezvous'
  },
  {
    id: 'swabbies',
    label: 'Swabbies',
    icon: Sailboat,
    description: 'The Port',
    linkKey: '/member/swabbies'
  },
  {
    id: 'beacon',
    label: 'Beacon',
    icon: TowerControl,
    description: 'The Lighthouse',
    linkKey: '/member/beacon'
  },
  ...(isMembership
    ? [
        {
          id: 'applications',
          label: 'Applications',
          icon: ClipboardList,
          description: 'Visitor Requests',
          linkKey: '/member/applications'
        }
      ]
    : []),
  {
    id: 'hidden-cove',
    label: 'Hidden Cove',
    icon: HiddenCoveSVG,
    description: 'Special tools, features, and perks waiting to be discovered',
    linkKey: '/member/hidden-cove'
  },
  {
    id: 'lore-and-lingo',
    label: 'Lore & Lingo',
    icon: BookOpenText,
    description: 'Decode the crew’s language — your map to every parley, anchor, and treasure maps.',
    linkKey: '/member/lore-and-lingo'
  }
]
