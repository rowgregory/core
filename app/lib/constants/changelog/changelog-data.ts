export interface ChangelogEntry {
  date: string
  version: string
  category: 'feature' | 'improvement' | 'bugfix' | 'security' | 'breaking'
  title: string
  description: string
  author: string
}

export const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    date: '2025-12-13',
    version: '1.11.24',
    category: 'security',
    title: 'Next.js Server Component Security Patch',
    description: 'Updated React, React-DOM, and Next.js dependencies to address critical code injection vulnerability.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-13',
    version: '1.11.24',
    category: 'security',
    title: 'React Ecosystem Security Updates',
    description: 'Upgraded entire React ecosystem including react@19, react-dom@19 to mitigate SSR injection risks.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'feature',
    title: 'Google Analytics 4 Integration',
    description: 'Integrated GA4 tracking with proper head placement for analytics detection.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'improvement',
    title: 'Action Item Dropdown Descriptions',
    description:
      'Added descriptive text to action items in dropdown menus for better clarity and user guidance. Improved UX by providing context for each available action.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'bugfix',
    title: 'User List Loading Fix',
    description:
      "Fixed bug where users weren't loading from SSR action, causing empty user list to not render properly. Corrected data flow to properly dispatch and display users from server-side data.",
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'feature',
    title: 'Admin Changelog Page',
    description:
      'Created professional changelog page grouped by version with collapsible sections, stats overview showing total updates by category, and expandable version entries with detailed change descriptions.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'improvement',
    title: 'Treasure Map Counting Logic Enhancement',
    description:
      'Updated treasure map counting to use closedAt date when available, falling back to createdAt for open treasure maps. Provides more accurate daily statistics and better reflects active vs closed treasure maps.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'feature',
    title: 'Lore & Lingo Terminology Page',
    description:
      'Created comprehensive Lore & Lingo page featuring key Member terminology with definitions, usage examples, and meeting phrases. Helps users understand platform-specific language for clearer communication.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'feature',
    title: 'Info Banners for Modules',
    description:
      'Added InfoBanner components explaining Swabbie, Grog, Booty, and other modules. Each banner shows users what the module does and whether it is locked or unlocked.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'improvement',
    title: 'Login Header Optimized for Mobile',
    description:
      'Updated LoginHeader to hide the ShipWheel on xs screens and adjust spacing and font sizes for better mobile responsiveness.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'feature',
    title: 'Quick Actions Descriptions Added',
    description:
      'Added descriptions for all Quick Action buttons: Schedule Parley, Send Treasure Map, Drop Anchor, Draft Swabbie.',
    author: 'Sqysh'
  },
  {
    date: '2025-12-18',
    version: '1.11.25',
    category: 'improvement',
    title: 'Mobile Responsiveness Audit',
    description:
      'Went through every page and adjusted spacing, alignment, and layout so that all elements look clean, consistent, and polished on mobile screens.',
    author: 'Sqysh'
  }
]
