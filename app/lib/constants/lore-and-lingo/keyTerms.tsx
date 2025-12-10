import HiddenCoveSVG from '@/public/svg/HiddenCoveSVG'
import { Anchor, Scroll, Layers, TowerControl, Sailboat, Crosshair, Flag } from 'lucide-react'

const keyTerms = [
  {
    id: 'treasure-maps',
    label: 'Treasure Maps',
    icon: Layers,
    description: 'Referrals you send to another member.',
    color: 'bg-cyan-500/20',
    phrase: 'I sent a Treasure Map to refer a client to Sqysh.',
    linkKey: '/admin/treasure-maps'
  },
  {
    id: 'anchors',
    label: 'Anchors',
    icon: Anchor,
    description: 'Thank You for Closed Business — confirmed revenue earned from a referral.',
    color: 'bg-violet-500/20',
    phrase: 'I dropped an Anchor to thank Sqysh for a closed deal.',
    linkKey: '/admin/anchors'
  },
  {
    id: 'parleys',
    label: 'Parleys',
    icon: Scroll,
    description: '1-2-1 meetings between two members.',
    color: 'bg-amber-500/20',
    phrase: 'I had a Parley with Sqysh to discuss new opportunities.',
    linkKey: '/admin/parleys'
  },
  {
    id: 'stowaways',
    label: 'Stowaways',
    icon: Flag,
    description: 'Visitors attending a chapter meeting.',
    color: 'bg-rose-500/20',
    status: 'FLAGGED',
    phrase: 'We had a Stowaway visit today for a quick introduction.',
    linkKey: '/admin/stowaways'
  },
  {
    id: 'rendezvous',
    label: 'Rendezvous',
    icon: Crosshair,
    description: 'The full meeting schedule for your chapter.',
    color: 'bg-blue-500/20',
    phrase: 'Our next Rendezvous is scheduled for Thursday at 7 AM.',
    linkKey: '/admin/rendezvous'
  },
  {
    id: 'swabbies',
    label: 'Swabbies',
    icon: Sailboat,
    description: 'Users who have applied and are pending review.',
    color: 'bg-yellow-500/20',
    status: 'PENDING',
    phrase: 'This Swabbie has completed the form and is awaiting review.',
    linkKey: '/admin/swabbies'
  },
  {
    id: 'beacon',
    label: 'Beacon',
    icon: TowerControl,
    description: 'Your profile page where you update your information.',
    color: 'bg-emerald-500/20',
    phrase: 'I updated my Beacon to reflect my latest achievements.',
    linkKey: '/admin/beacon'
  },
  {
    id: 'hidden-cove',
    label: 'Hidden Cove',
    icon: HiddenCoveSVG,
    description: 'A section that displays new features and tools.',
    color: 'bg-fuchsia-500/20',
    phrase: 'Check the Hidden Cove for the latest features available.',
    linkKey: '/admin/hidden-cove'
  }
]

export default keyTerms
