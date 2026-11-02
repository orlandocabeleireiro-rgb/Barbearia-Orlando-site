import { AnimatePresence, motion } from 'framer-motion'
import { NAV, SITE } from '../data/site'

const ease = [0.76, 0, 0.24, 1] as const

export default function Menu({ open, go }: { open: boolean; go: (href: string) => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="menu"
          className="pad fixed inset-0 z-[70] flex flex-col justify-between bg-navy pb-10 pt-28"
          initial={{ clipPath: 'circle(0% at 100% 0%)' }}
          animate={{ clipPath: 'circle(150% at 100% 0%)' }}
          exit={{ clipPath: 'circle(0% at 100% 0%)' }}
          transition={{ duration: 0.9, ease }}
        >
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.href} className="mask">
                <motion.a
                  href={n.href}
                  onClick={(e) => (e.preventDefault(), go(n.href))}
                  className="display group flex items-baseline gap-4 text-[15vw] text-cream md:text-[9vw]"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '110%' }}
                  transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.07 }}
                >
                  <span className="label text-brass">0{i + 1}</span>
                  <span className="transition-colors duration-300 group-hover:italic group-hover:text-barber">{n.label}</span>
                </motion.a>
              </li>
            ))}
          </ul>
          <motion.div
            className="label grid gap-2 text-cream/70 sm:grid-cols-3"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <a href={SITE.maps} target="_blank" rel="noopener">{SITE.address.join(' · ')}</a>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={SITE.instagram} target="_blank" rel="noopener">{SITE.instagramLabel}</a>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
