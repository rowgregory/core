const QuickActionButton = ({ title, icon: Icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className={`
    group relative overflow-hidden
    flex items-center justify-center space-x-3 
    w-full px-6 py-4 
    rounded-lg border border-transparent
    bg-linear-to-r ${color}
    text-white font-semibold text-sm tracking-wide
    shadow-lg shadow-black/10
    transition-all duration-200 ease-out
    hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5
    active:translate-y-0 active:shadow-md
    focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent
  `}
  >
    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
    <span className="relative z-10">{title}</span>

    {/* Subtle shine effect on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </div>
  </button>
)

export default QuickActionButton
