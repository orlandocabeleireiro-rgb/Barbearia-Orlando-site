import { SITE } from '../data/site'
import { MaskLines } from '../components/MaskLines'
import { InstagramIcon } from '../components/Icons'
import posts from '../data/instagram.json'

type Tile = { src: string; pos?: string; url?: string; alt?: string; video?: boolean }

// fotos do espaço (enquanto não há publicações do Instagram)
const FALLBACK: Tile[] = [
  { src: 'assets/espaco/montra.webp', pos: '50% 42%' },
  { src: 'assets/espaco/cadeira.webp', pos: '50% 58%' },
  { src: 'assets/espaco/ferramentas.webp', pos: '50% 45%' },
  { src: 'assets/espaco/polo.webp', pos: '70% 38%' },
]
// últimas publicações, preenchidas automaticamente por scripts/fetch-instagram.mjs
const TILES: Tile[] = (posts as Tile[]).length >= 4 ? (posts as Tile[]) : FALLBACK

/** Faixa do Instagram: convite a seguir, com mosaico de imagens a ligar ao perfil. */
export function Instagram() {
  return (
    <section id="instagram" className="pad relative bg-abyss pb-[6vh] pt-[16vh]" aria-label="Instagram">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="label flex items-center gap-2 text-brass">
            <InstagramIcon className="h-4 w-4" /> Redes sociais
          </span>
          <MaskLines
            as="h2"
            className="display mt-4 text-[13vw] text-cream md:text-[7.5vw]"
            lines={['Segue-nos', <em className="font-normal italic text-brass">nas redes sociais.</em>]}
          />
          <p className="mt-6 max-w-sm font-serif text-lg text-cream/70">Cortes, novidades e o dia a dia da barbearia no Instagram, em {SITE.instagramLabel}.</p>
        </div>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener"
          className="label group inline-flex items-center gap-3 self-start rounded-full border border-cream/30 px-6 py-4 text-cream transition-colors hover:border-brass hover:text-brass md:self-auto"
        >
          <InstagramIcon className="h-5 w-5" />
          Seguir {SITE.instagramLabel}
          <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
        </a>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {TILES.map(({ src, pos, url, alt }, i) => (
          <a
            key={src}
            href={url ?? SITE.instagram}
            target="_blank"
            rel="noopener"
            data-cursor="view"
            aria-label={alt ? `Ver no Instagram: ${alt}` : `Ver no Instagram (${i + 1})`}
            className="group relative aspect-square overflow-hidden rounded-[18px] bg-navy"
          >
            <img src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: pos ?? '50% 50%' }} className="photo-grade h-full w-full object-cover transition-[filter,transform] duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 flex items-center justify-center bg-abyss/0 text-cream opacity-0 transition-all duration-500 group-hover:bg-abyss/50 group-hover:opacity-100">
              <InstagramIcon className="h-8 w-8" />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
