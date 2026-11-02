/**
 * Carregamento real de assets para o preloader: cada imagem conta quando
 * está decodificada. Também guarda os frames da sequência para o canvas.
 */
type Progress = (p: number) => void

const cache = new Map<string, HTMLImageElement>()

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  const hit = cache.get(src)
  if (hit) return Promise.resolve(hit)
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    const done = () => {
      cache.set(src, img)
      resolve(img)
    }
    img.decode().then(done).catch(() => (img.complete && img.naturalWidth ? done() : resolve(null)))
  })
}

export const getCached = (src: string) => cache.get(src)

export async function loadAll(srcs: string[], onProgress: Progress, concurrency = 6) {
  let done = 0
  const queue = [...srcs]
  const total = Math.max(1, srcs.length)
  const worker = async () => {
    while (queue.length) {
      const s = queue.shift()!
      await loadImage(s)
      done++
      onProgress(done / total)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
}

export type SequenceManifest = {
  fps: number
  desktop: { count: number; width: number; height: number; path: string }
  mobile: { count: number; width: number; height: number; path: string }
}

let manifestPromise: Promise<SequenceManifest | null> | null = null
export function getSequenceManifest() {
  manifestPromise ??= fetch('sequences/corte/manifest.json')
    .then((r) => (r.ok ? (r.json() as Promise<SequenceManifest>) : null))
    .then((m) => (m?.desktop?.count && m?.mobile?.count ? m : null))
    .catch(() => null)
  return manifestPromise
}

export function sequenceFrames(m: SequenceManifest, mobile: boolean) {
  const v = mobile ? m.mobile : m.desktop
  return Array.from({ length: v.count }, (_, i) => `${v.path}/${String(i + 1).padStart(4, '0')}.webp`)
}
