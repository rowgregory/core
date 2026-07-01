'use client'

// The A–Z tray. Letters that were guessed and HIT show in white; guessed and
// MISSED show crossed-off and dim; untried letters are neutral. This is the
// read-only display version used on the TV and as a reference on phones.

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface LetterTrayProps {
  revealed: string[] // hits
  guessed: string[] // every attempt
  compact?: boolean
}

export default function LetterTray({ revealed, guessed, compact }: LetterTrayProps) {
  const hitSet = new Set(revealed)
  const guessedSet = new Set(guessed)

  const size = compact ? 'w-6 h-6 text-[11px]' : 'w-9 h-9 text-sm'

  return (
    <div className={`flex flex-wrap justify-center ${compact ? 'gap-1' : 'gap-1.5'}`}>
      {ALPHABET.map((L) => {
        const tried = guessedSet.has(L)
        const hit = hitSet.has(L)
        let cls = 'border-white/15 text-white/70'
        if (tried && hit) cls = 'border-emerald-400 text-emerald-300 bg-emerald-400/10'
        else if (tried) cls = 'border-white/5 text-white/25 line-through'
        return (
          <div key={L} className={`${size} flex items-center justify-center border font-mono font-bold ${cls}`}>
            {L}
          </div>
        )
      })}
    </div>
  )
}
