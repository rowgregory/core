import { Code, Zap, Shield, Settings } from 'lucide-react'

export const CATEGORY_CONFIG = {
  feature: { label: 'Feature', icon: Zap, color: 'text-violet-400' },
  improvement: { label: 'Improvement', icon: Settings, color: 'text-purple-400' },
  bugfix: { label: 'Bug Fix', icon: Code, color: 'text-emerald-400' },
  security: { label: 'Security', icon: Shield, color: 'text-red-400' },
  breaking: { label: 'Breaking', icon: Zap, color: 'text-orange-400' }
}
