import { Lock, Zap } from 'lucide-react'

export const LockedModuleBanner = () => {
  return (
    <div className="relative overflow-hidden bg-linear-to-r from-lime-950/40 via-emerald-950/30 to-lime-950/40 border border-lime-700/50 rounded-lg p-4 mb-4">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(132,204,22,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.3),transparent_50%)]"></div>
      </div>

      {/* Content */}
      <div className="relative flex items-center gap-3">
        {/* Lock icon with bounce animation */}
        <div className="animate-bounce shrink-0">
          <div className="relative">
            <Lock className="w-5 h-5 text-lime-400 drop-shadow-lg" />
            <div className="absolute inset-0 animate-pulse">
              <Lock className="w-5 h-5 text-lime-300 opacity-50" />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1">
          <p className="text-sm font-bold text-lime-100">This treasure be locked, Cap'n! 🔒</p>
          <p className="text-xs text-lime-200/70">Talk to Sqysh to unlock this feature</p>
        </div>

        {/* Decorative zap icon */}
        <Zap className="w-4 h-4 text-lime-400/60 shrink-0 animate-pulse" />
      </div>

      {/* Subtle animated border glow */}
      <div className="absolute inset-0 rounded-lg border border-lime-400/0 pointer-events-none animate-pulse"></div>
    </div>
  )
}
