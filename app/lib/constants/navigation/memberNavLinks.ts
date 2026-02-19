import {
  TowerControl,
  Ship,
  Anchor,
  Scroll,
  Layers,
  Crosshair,
  Flag,
  ClipboardList,
  BookOpenText,
  Users
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
    description: 'Visitors with unknown joining status',
    linkKey: '/member/stowaways'
  },
  {
    id: 'rendezvous',
    label: 'Rendezvous',
    icon: Crosshair,
    description: 'Calendar',
    linkKey: '/member/rendezvous'
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: ClipboardList,
    description: 'Visitor Requests',
    linkKey: '/member/applications'
  },
  {
    id: 'beacon',
    label: 'Beacon',
    icon: TowerControl,
    description: 'Profile',
    linkKey: '/member/beacon'
  },
  {
    id: 'navigators',
    label: 'Navigators',
    icon: Users,
    description: 'Member Directory',
    linkKey: '/member/navigators'
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
    id: 'lore-and-lingo',
    label: 'Lore & Lingo',
    icon: BookOpenText,
    description: 'Decode the crew’s language.',
    linkKey: '/member/lore-and-lingo'
  }
  // {
  //   id: 'changelog',
  //   label: 'Changelog',
  //   icon: GitBranch,
  //   description: 'Track updates, improvements, and new features.',
  //   linkKey: '/member/changelog'
  // }
  // {
  //   id: 'hidden-cove',
  //   label: 'Hidden Cove',
  //   icon: HiddenCoveSVG,
  //   description: 'Special tools, features, and perks waiting to be discovered',
  //   linkKey: '/member/hidden-cove'
  // }
]
