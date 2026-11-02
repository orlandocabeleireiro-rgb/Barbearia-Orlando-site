import { ScrollTrigger } from './gsap'

/**
 * Fila de configuração das animações de scroll: cada secção é montada na sua
 * própria tarefa (por ordem, de cima para baixo), para não bloquear a thread
 * principal num único bloco longo. No fim, um único ScrollTrigger.refresh().
 */
type Job = { id: number; run: () => void }
const queue: Job[] = []
let seq = 0
let running = false
let armed = false
let refreshTimer = 0

const nextTask = (fn: () => void) => {
  const ch = new MessageChannel()
  ch.port1.onmessage = () => fn()
  ch.port2.postMessage(0)
}

function pump() {
  const job = queue.shift()
  if (!job) {
    running = false
    requestRefresh()
    return
  }
  job.run()
  nextTask(pump)
}

export function enqueue(run: () => void) {
  const id = ++seq
  queue.push({ id, run })
  if (armed && !running) {
    running = true
    nextTask(pump)
  }
  return id
}

export function cancel(id: number) {
  const i = queue.findIndex((j) => j.id === id)
  if (i >= 0) queue.splice(i, 1)
}

export function requestRefresh(delay = 120) {
  clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  }, delay)
}

/** Liga a fila. Até lá os trabalhos ficam pendentes (no telemóvel: até à 1.ª interação ou inatividade). */
export function arm() {
  if (armed) return
  armed = true
  if (queue.length && !running) {
    running = true
    nextTask(pump)
  }
}
