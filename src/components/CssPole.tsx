/** Poste em CSS puro: usado no preloader e hero do telemóvel antes do 3D, e no modo reduced-motion. */
export function CssPole({ className = '', animate = true }: { className?: string; animate?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${className}`} aria-hidden>
      <div className="h-[4%] w-[9%] rounded-full bg-gradient-to-b from-[#e2c08a] to-[#7d6038]" />
      <div className="mt-[1%] h-[7%] w-[34%] rounded-t-[40%] bg-gradient-to-b from-[#d9b57f] via-brass to-[#6e5230]" />
      <div className="relative h-[72%] w-[26%] overflow-hidden">
        <div
          className={`absolute inset-x-0 -top-[40%] h-[180%] ${animate ? 'css-pole-stripes' : ''}`}
          style={{
            background:
              'repeating-linear-gradient(-38deg,#A8322D 0 7%,#EDE3CC 7% 14%,#2C4467 14% 21%,#EDE3CC 21% 28%)',
          }}
        />
        <div className="absolute inset-0 shadow-[inset_-14px_0_22px_rgba(0,0,0,.55),inset_10px_0_16px_rgba(255,255,255,.28)]" />
        <div className="absolute inset-y-0 left-[22%] w-[6%] bg-white/30 blur-[1px]" />
      </div>
      <div className="h-[7%] w-[34%] rounded-b-[40%] bg-gradient-to-t from-[#5a4226] via-brass to-[#d9b57f]" />
      <div className="h-[5%] w-[16%] rounded-b-full bg-gradient-to-b from-brass to-[#5a4226]" />
    </div>
  )
}
