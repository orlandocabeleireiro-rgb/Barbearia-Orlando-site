import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { BarberPole } from './BarberPole'
import { Dust } from './Dust'
import { heroState } from './state'

type Props = {
  variant: 'hero' | 'preloader'
  quality: 'high' | 'low'
  active: boolean
  particles?: number
  onReady?: () => void
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Rig({ variant }: { variant: Props['variant'] }) {
  const group = useRef<THREE.Group>(null)
  const smooth = useRef({ p: 0, px: 0, py: 0 })

  useFrame(({ camera, clock, size }, dt) => {
    const g = group.current
    if (!g) return
    const s = smooth.current
    const k = 1 - Math.exp(-dt * 5)
    s.px += (heroState.px - s.px) * k
    s.py += (heroState.py - s.py) * k

    if (variant === 'preloader') {
      g.rotation.y = clock.elapsedTime * 0.9
      camera.position.set(0, 0.25, 12.5)
      camera.lookAt(0, 0.25, 0)
      return
    }

    s.p += (heroState.progress - s.p) * (1 - Math.exp(-dt * 8))
    const p = ease(Math.min(1, Math.max(0, s.p)))
    // dolly da câmara: de plano geral até as riscas encherem o ecrã
    // em retrato (telemóvel) afasta a câmara e sobe o poste para libertar o título
    const portrait = size.width / size.height < 0.8
    const z0 = portrait ? 15.5 : 11.5
    const y0 = portrait ? -1.35 : 0.25
    const z = THREE.MathUtils.lerp(z0, 0.78, p)
    const y = THREE.MathUtils.lerp(y0, 0.05, p)
    camera.position.set(s.px * 0.6 * (1 - p), y - s.py * 0.3 * (1 - p), z)
    camera.lookAt(0, y, 0)
    ;(camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(30, 42, p)
    camera.updateProjectionMatrix()

    g.rotation.y = s.px * 0.35 + clock.elapsedTime * 0.08
    g.rotation.x = s.py * 0.12
    g.rotation.z = THREE.MathUtils.lerp(-0.06, -0.45, p)
  })

  return (
    <group ref={group}>
      <BarberPole quality={variant === 'preloader' ? 'low' : 'high'} spin={variant === 'preloader' ? 3 : 1} />
    </group>
  )
}

export default function HeroScene({ variant, quality, active, particles = 0, onReady }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.25, 11.5], fov: 30, near: 0.1, far: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
      onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))}
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[-4, 6, 5]} angle={0.5} penumbra={1} intensity={60} color="#ffcf94" />
      <pointLight position={[3, -2, 3]} intensity={6} color="#A8322D" />
      <Environment resolution={quality === 'high' ? 256 : 64} frames={1}>
        <Lightformer form="rect" intensity={3.5} color="#ffd9a8" position={[-3, 2, 3]} scale={[2, 7, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[3, 1, 2]} scale={[1, 6, 1]} />
        <Lightformer form="ring" intensity={2} color="#B8925A" position={[0, 5, -3]} scale={3} />
        <Lightformer form="rect" intensity={0.6} color="#A8322D" position={[0, -4, 2]} scale={[8, 1, 1]} />
      </Environment>
      <Rig variant={variant} />
      {particles > 0 && <Dust count={particles} />}
    </Canvas>
  )
}
