import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { Dust } from './Dust'
import { scissorsState } from './state'

const BRASS = '#B8925A'
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeIn = (t: number) => t * t * t

// comprimento total do modelo (ponta da lâmina → fim da argola), para encaixar no ecrã
const LEN = 4.55
const OPEN = 0.46

/** Lâmina superior (aresta de corte em y=0, ponta em -x); a inferior é o espelho. */
function bladeShape() {
  const s = new THREE.Shape()
  s.moveTo(0.32, -0.04)
  s.lineTo(-2.62, -0.005)
  s.quadraticCurveTo(-1.5, 0.3, 0.05, 0.24)
  s.quadraticCurveTo(0.3, 0.2, 0.32, -0.04)
  return s
}
/** Braço que liga o parafuso à argola (vai para +x e para baixo). */
function armShape() {
  const s = new THREE.Shape()
  s.moveTo(0.05, 0.16)
  s.quadraticCurveTo(0.7, -0.02, 1.12, -0.3)
  s.lineTo(1.08, -0.5)
  s.quadraticCurveTo(0.6, -0.26, -0.02, -0.12)
  s.lineTo(0.05, 0.16)
  return s
}

function Half({
  mirror,
  geo,
  steel,
  brass,
}: {
  mirror: boolean
  geo: { blade: THREE.BufferGeometry; arm: THREE.BufferGeometry; ring: THREE.BufferGeometry }
  steel: THREE.Material
  brass: THREE.Material
}) {
  return (
    <group scale={[1, mirror ? -1 : 1, 1]} position={[0, 0, mirror ? -0.035 : 0.035]}>
      <mesh geometry={geo.blade} material={steel} position={[0, 0, -0.025]} />
      <mesh geometry={geo.arm} material={brass} position={[0, 0, -0.03]} />
      <mesh geometry={geo.ring} material={brass} position={[1.42, -0.68, 0]} scale={[1.18, 1, 1]} />
    </group>
  )
}

function Scissors() {
  const root = useRef<THREE.Group>(null)
  const a = useRef<THREE.Group>(null)
  const b = useRef<THREE.Group>(null)
  const glint = useRef<THREE.PointLight>(null)
  const smooth = useRef({ p: 0 })

  const geo = useMemo(() => {
    const bevel = { bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.016, bevelSegments: 3, curveSegments: 24 }
    return {
      blade: new THREE.ExtrudeGeometry(bladeShape(), { depth: 0.05, ...bevel }),
      arm: new THREE.ExtrudeGeometry(armShape(), { depth: 0.06, ...bevel }),
      ring: new THREE.TorusGeometry(0.4, 0.085, 20, 64),
    }
  }, [])
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f3eee6', metalness: 0.9, roughness: 0.18, envMapIntensity: 2.6 }), [])
  const brass = useMemo(() => new THREE.MeshStandardMaterial({ color: BRASS, metalness: 1, roughness: 0.22, envMapIntensity: 1.3 }), [])

  useFrame(({ clock, viewport, camera }, dt) => {
    const g = root.current
    if (!g || !a.current || !b.current) return
    const s = smooth.current
    s.p += (scissorsState.progress - s.p) * (1 - Math.exp(-dt * 12))
    const p = s.p

    // encaixe no ecrã: em retrato ocupa a largura toda; em paisagem ~62%
    const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0))
    const portrait = vp.width / vp.height < 0.8
    const target = portrait ? vp.width * 0.94 : Math.min(vp.width * 0.62, vp.height * 1.3)
    g.scale.setScalar(target / LEN)

    // 1) entra de lado (da direita), aberta, a rodar para o plano do ecrã
    const fly = easeOut(clamp(p / 0.44))
    // 3) depois do corte, sai disparada para a esquerda
    const out = easeIn(clamp((p - 0.53) / 0.22))
    const offR = vp.width * 0.5 + target * 0.9
    const offL = -(vp.width * 0.5 + target * 0.9)
    g.position.x = THREE.MathUtils.lerp(offR, 0, fly) + (offL - 0) * out + (0.33 / LEN) * target
    g.position.y = Math.sin(clock.elapsedTime * 1.3) * 0.03 * (1 - out)
    g.position.z = THREE.MathUtils.lerp(-2.5, 0, fly)
    g.rotation.y = THREE.MathUtils.lerp(-1.25, 0.16, fly) - 0.2 * out
    g.rotation.x = THREE.MathUtils.lerp(0.5, 0.08, fly)
    g.rotation.z = THREE.MathUtils.lerp(0.55, -0.04, fly) + 0.08 * out

    // 2) uma só tesourada, seca
    const snap = clamp((p - 0.45) / 0.05)
    const angle = OPEN * (1 - easeIn(snap))
    a.current.rotation.z = -angle
    b.current.rotation.z = angle

    if (glint.current) glint.current.intensity = 40 * Math.sin(Math.PI * clamp((p - 0.48) / 0.08))
  })

  return (
    <group ref={root}>
      <group ref={a}>
        <Half mirror={false} geo={geo} steel={steel} brass={brass} />
      </group>
      <group ref={b}>
        <Half mirror geo={geo} steel={steel} brass={brass} />
      </group>
      {/* parafuso */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={brass}>
        <cylinderGeometry args={[0.13, 0.13, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 0, 0.1]} material={steel}>
        <sphereGeometry args={[0.07, 24, 12]} />
      </mesh>
      <pointLight ref={glint} position={[-0.6, 0, 0.8]} intensity={0} distance={6} color="#ffe2b0" />
    </group>
  )
}

export default function ScissorsScene({
  quality,
  active,
  particles = 0,
  onReady,
}: {
  quality: 'high' | 'low'
  active: boolean
  particles?: number
  onReady?: () => void
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[-4, 6, 5]} angle={0.5} penumbra={1} intensity={60} color="#ffcf94" />
      <pointLight position={[3, -3, 2]} intensity={3} color="#A8322D" />
      <directionalLight position={[2, 3, 6]} intensity={2.2} color="#ffe6c4" />
      <Environment resolution={quality === 'high' ? 256 : 64} frames={1}>
        <Lightformer form="rect" intensity={3.5} color="#ffd9a8" position={[-3, 2, 3]} scale={[2, 7, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[3, 1, 2]} scale={[1, 6, 1]} />
        <Lightformer form="ring" intensity={2} color="#B8925A" position={[0, 5, -3]} scale={3} />
        <Lightformer form="rect" intensity={0.6} color="#A8322D" position={[0, -4, 2]} scale={[8, 1, 1]} />
      </Environment>
      <Scissors />
      {particles > 0 && <Dust count={particles} />}
    </Canvas>
  )
}
