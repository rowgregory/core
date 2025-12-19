import HiddenCoveSVG from '@/public/svg/HiddenCoveSVG'
import {
  Users,
  ClipboardList,
  FileText,
  TowerControl,
  Anchor,
  Sliders,
  Ship,
  Scroll,
  Layers,
  LifeBuoy,
  Beer,
  Coins,
  Crosshair,
  Flag,
  BookOpenText,
  GitBranch
} from 'lucide-react'

export const adminNavLinks = [
  {
    id: 'bridge',
    label: 'Bridge',
    icon: Ship,
    description: 'Dashboard',
    linkKey: '/admin/bridge'
  },
  {
    id: 'parley',
    label: 'Parley',
    icon: Scroll,
    description: '1-2-1',
    linkKey: '/admin/parley'
  },
  {
    id: 'treasure-maps',
    label: 'Treasure Maps',
    icon: Layers,
    description: 'Referrals',
    linkKey: '/admin/treasure-maps'
  },
  {
    id: 'anchors',
    label: 'Anchors',
    icon: Anchor,
    description: 'Thank You For Closed Business',
    linkKey: '/admin/anchors'
  },
  {
    id: 'muster',
    label: 'Muster',
    icon: LifeBuoy,
    description: 'The Crew Quarters',
    linkKey: '/admin/muster'
  },
  {
    id: 'stowaways',
    label: 'Stowaways',
    icon: Flag,
    description: 'The Brig',
    linkKey: '/admin/stowaways'
  },
  {
    id: 'rendezvous',
    label: 'Rendezvous',
    icon: Crosshair,
    description: 'The Gathering Point',
    linkKey: '/admin/rendezvous'
  },
  {
    id: 'beacon',
    label: 'Beacon',
    icon: TowerControl,
    description: 'The Lighthouse',
    linkKey: '/admin/beacon'
  },
  {
    id: 'navigators',
    label: 'Navigators',
    icon: Users,
    description: 'Member Directory',
    linkKey: '/admin/navigators'
  },
  {
    id: 'grogs',
    label: 'Grogs',
    icon: Beer,
    description: 'The Tavern',
    linkKey: '/admin/grogs'
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: ClipboardList,
    description: 'Visitor Requests',
    linkKey: '/admin/applications'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    description: 'Analytics & Reports',
    linkKey: '/admin/reports'
  },
  {
    id: 'booty',
    label: 'Booty',
    icon: Coins,
    description: 'The Treasure Vault',
    linkKey: '/admin/booty'
  },

  {
    id: 'rigging',
    label: 'Rigging',
    icon: Sliders,
    description: 'Chapter Configuration',
    linkKey: '/admin/rigging'
  },
  {
    id: 'lore-and-lingo',
    label: 'Lore & Lingo',
    icon: BookOpenText,
    description: 'Decode the crew’s language — your map to every parley, anchor, and treasure maps.',
    linkKey: '/admin/lore-and-lingo'
  },
  {
    id: 'changelog',
    label: 'Changelog',
    icon: GitBranch,
    description: 'Track updates, improvements, and new features — your complete history of platform evolution.',
    linkKey: '/admin/changelog'
  },
  {
    id: 'hidden-cove',
    label: 'Hidden Cove',
    icon: HiddenCoveSVG,
    description: 'Special tools, features, and perks waiting to be discovered',
    linkKey: '/admin/hidden-cove'
  }
]
