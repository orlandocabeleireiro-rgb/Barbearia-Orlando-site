// Adereços procedurais para as "fotografias" 3D (renderizadas offline, não vão para o site).
import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

/* ---------- texturas em canvas ---------- */
function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = 1) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.anisotropy = 8
  return t
}
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

export function useWood(tone = '#4a2a17') {
  return useMemo(
    () =>
      canvasTex(1024, 1024, (c) => {
        c.fillStyle = tone
        c.fillRect(0, 0, 1024, 1024)
        for (let i = 0; i < 260; i++) {
          const y = rnd(0, 1024)
          c.strokeStyle = `rgba(${Math.random() < 0.5 ? '20,8,2' : '120,70,35'},${rnd(0.05, 0.25)})`
          c.lineWidth = rnd(1, 6)
          c.beginPath()
          c.moveTo(0, y)
          for (let x = 0; x <= 1024; x += 64) c.lineTo(x, y + Math.sin(x / rnd(80, 200) + i) * rnd(2, 10))
          c.stroke()
        }
      }),
    [tone],
  )
}

export function useMarble() {
  return useMemo(
    () =>
      canvasTex(1024, 1024, (c) => {
        c.fillStyle = '#e9e4da'
        c.fillRect(0, 0, 1024, 1024)
        for (let i = 0; i < 40; i++) {
          c.strokeStyle = `rgba(110,100,95,${rnd(0.05, 0.3)})`
          c.lineWidth = rnd(0.5, 3)
          c.beginPath()
          let x = rnd(-200, 1024)
          let y = rnd(0, 1024)
          c.moveTo(x, y)
          for (let k = 0; k < 30; k++) {
            x += rnd(10, 50)
            y += rnd(-30, 30)
            c.lineTo(x, y)
          }
          c.stroke()
        }
      }),
    [],
  )
}

export function useTiles() {
  return useMemo(
    () =>
      canvasTex(
        512,
        512,
        (c) => {
          const n = 8
          const s = 512 / n
          for (let i = 0; i < n; i++)
            for (let j = 0; j < n; j++) {
              c.fillStyle = (i + j) % 2 ? '#141414' : '#e8e1d0'
              c.fillRect(i * s, j * s, s, s)
            }
          c.strokeStyle = 'rgba(0,0,0,.25)'
          for (let i = 0; i <= n; i++) {
            c.beginPath()
            c.moveTo(i * s, 0)
            c.lineTo(i * s, 512)
            c.moveTo(0, i * s)
            c.lineTo(512, i * s)
            c.stroke()
          }
        },
        4,
      ),
    [],
  )
}

export function usePlaster(color = '#1c2636') {
  return useMemo(
    () =>
      canvasTex(512, 512, (c) => {
        c.fillStyle = color
        c.fillRect(0, 0, 512, 512)
        for (let i = 0; i < 6000; i++) {
          c.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,240,220'},${rnd(0.01, 0.05)})`
          c.fillRect(rnd(0, 512), rnd(0, 512), rnd(1, 4), rnd(1, 4))
        }
      }),
    [color],
  )
}

export function useLabel(title: string, sub: string, bg = '#EDE3CC', fg = '#1F2A3A') {
  return useMemo(
    () =>
      canvasTex(1024, 512, (c) => {
        c.fillStyle = bg
        c.fillRect(0, 0, 1024, 512)
        c.strokeStyle = '#B8925A'
        c.lineWidth = 8
        c.strokeRect(300, 30, 424, 452)
        c.fillStyle = fg
        c.textAlign = 'center'
        c.font = '900 96px "Playfair Display", Georgia, serif'
        c.fillText(title.slice(0, 1), 512, 210)
        c.font = '900 54px "Playfair Display", Georgia, serif'
        c.fillText(title, 512, 290)
        c.font = 'italic 46px "Playfair Display", Georgia, serif'
        c.fillStyle = '#A8322D'
        c.fillText(sub, 512, 360)
        c.font = '600 22px "Barlow Condensed", Arial'
        c.fillStyle = fg
        c.fillText('P O R T O  ·  2 0 1 5', 512, 430)
      }),
    [title, sub, bg, fg],
  )
}

/* ---------- materiais ---------- */
export const steel = <meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.12} />
export const brass = <meshStandardMaterial color="#B8925A" metalness={1} roughness={0.22} />
export const chrome = <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.06} />

/* ---------- objetos ---------- */
export function Razor({ open = 2.5, ...p }: JSX.IntrinsicElements['group'] & { open?: number }) {
  const blade = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.05)
    s.lineTo(1.9, -0.12)
    s.quadraticCurveTo(2.25, -0.1, 2.2, 0.28)
    s.lineTo(0.25, 0.3)
    s.quadraticCurveTo(0, 0.25, 0, -0.05)
    return new THREE.ExtrudeGeometry(s, { depth: 0.025, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 })
  }, [])
  const handle = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(2.3, -0.05)
    s.quadraticCurveTo(2.55, 0.1, 2.3, 0.3)
    s.lineTo(0.05, 0.32)
    s.quadraticCurveTo(-0.15, 0.16, 0, 0)
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4 })
  }, [])
  return (
    <group {...p}>
      <mesh geometry={handle} castShadow receiveShadow position={[0, 0, -0.06]}>
        <meshPhysicalMaterial color="#1b1410" roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <mesh position={[0.12, 0.16, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 20]} />
        {brass}
      </mesh>
      <group position={[0.12, 0.16, 0]} rotation={[0, 0, open]}>
        <mesh geometry={blade} castShadow position={[-0.1, -0.1, 0]}>
          {steel}
        </mesh>
      </group>
    </group>
  )
}

export function Scissors(p: JSX.IntrinsicElements['group']) {
  const blade = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(2.4, 0.04)
    s.lineTo(2.5, 0.0)
    s.lineTo(0.1, -0.16)
    s.lineTo(-0.5, -0.1)
    s.lineTo(-0.5, 0.06)
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 })
  }, [])
  const half = (a: number, z: number) => (
    <group rotation={[0, 0, a]} position={[0, 0, z]}>
      <mesh geometry={blade} castShadow>
        {chrome}
      </mesh>
      <mesh position={[-0.85, a > 0 ? -0.22 : 0.22, 0.02]} castShadow>
        <torusGeometry args={[0.32, 0.06, 16, 48]} />
        {chrome}
      </mesh>
    </group>
  )
  return (
    <group {...p}>
      {half(0.13, 0)}
      {half(-0.13, 0.06)}
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.06, 20]} />
        {brass}
      </mesh>
    </group>
  )
}

export function Comb(p: JSX.IntrinsicElements['group']) {
  const teeth = Array.from({ length: 34 })
  return (
    <group {...p}>
      <RoundedBox args={[3, 0.28, 0.07]} radius={0.03} castShadow position={[0, 0.25, 0]}>
        <meshPhysicalMaterial color="#0d0d0f" roughness={0.3} clearcoat={0.8} />
      </RoundedBox>
      {teeth.map((_, i) => (
        <mesh key={i} position={[-1.42 + i * 0.086, -0.05, 0]} castShadow>
          <boxGeometry args={[0.04, i < 14 ? 0.45 : 0.36, 0.06]} />
          <meshPhysicalMaterial color="#0d0d0f" roughness={0.3} clearcoat={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export function Clipper(p: JSX.IntrinsicElements['group']) {
  return (
    <group {...p}>
      <RoundedBox args={[0.9, 2.6, 0.6]} radius={0.28} smoothness={6} castShadow>
        <meshPhysicalMaterial color="#121418" roughness={0.35} clearcoat={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.92, 0.5, 0.62]} radius={0.12} position={[0, 0.2, 0]} castShadow>
        {brass}
      </RoundedBox>
      <mesh position={[0, 1.38, 0.05]} castShadow>
        <boxGeometry args={[0.82, 0.18, 0.12]} />
        {chrome}
      </mesh>
    </group>
  )
}

function lathe(pts: [number, number][], seg = 48) {
  return new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg)
}

export function Brush(p: JSX.IntrinsicElements['group']) {
  const handle = useMemo(() => lathe([[0, 0], [0.42, 0], [0.45, 0.06], [0.36, 0.2], [0.3, 0.5], [0.34, 0.8], [0.4, 0.95], [0.38, 1.0], [0, 1.0]]), [])
  const knot = useMemo(() => lathe([[0, 0], [0.34, 0], [0.44, 0.3], [0.5, 0.62], [0.46, 0.85], [0.32, 1.0], [0, 1.06]], 64), [])
  const hair = useMemo(
    () =>
      canvasTex(256, 256, (c) => {
        const g = c.createLinearGradient(0, 256, 0, 0)
        g.addColorStop(0, '#2a2420')
        g.addColorStop(0.45, '#d9d0c0')
        g.addColorStop(0.62, '#2b2622')
        g.addColorStop(1, '#efe8dc')
        c.fillStyle = g
        c.fillRect(0, 0, 256, 256)
        for (let i = 0; i < 2500; i++) {
          c.strokeStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${rnd(0.05, 0.2)})`
          const x = rnd(0, 256)
          c.beginPath()
          c.moveTo(x, rnd(0, 256))
          c.lineTo(x + rnd(-2, 2), rnd(0, 256))
          c.stroke()
        }
      }),
    [],
  )
  return (
    <group {...p}>
      <mesh geometry={handle} castShadow receiveShadow>
        <meshPhysicalMaterial color="#e8dcc0" roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 48]} />
        {brass}
      </mesh>
      <mesh geometry={knot} position={[0, 0.98, 0]} castShadow>
        <meshStandardMaterial map={hair} roughness={0.9} />
      </mesh>
    </group>
  )
}

export function Bowl({ foam = true, ...p }: JSX.IntrinsicElements['group'] & { foam?: boolean }) {
  const bowl = useMemo(() => lathe([[0, 0], [0.9, 0], [1.0, 0.05], [1.15, 0.5], [1.25, 0.75], [1.2, 0.78], [1.08, 0.5], [0, 0.12]], 64), [])
  const bubbles = useMemo(
    () =>
      Array.from({ length: 900 }, () => {
        const a = rnd(0, Math.PI * 2)
        const r = Math.sqrt(Math.random()) * 1.0
        const x = Math.cos(a) * r
        const z = Math.sin(a) * r
        const dome = 0.62 + 0.38 * (1 - r * r) + rnd(-0.04, 0.04)
        return [x, dome, z, rnd(0.04, 0.11)] as const
      }),
    [],
  )
  return (
    <group {...p}>
      <mesh geometry={bowl} castShadow receiveShadow>
        <meshPhysicalMaterial color="#1F2A3A" roughness={0.15} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      {foam &&
        bubbles.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 10, 8]} />
            <meshPhysicalMaterial color="#d8d2c8" roughness={0.7} clearcoat={0.2} />
          </mesh>
        ))}
    </group>
  )
}

export function Bottle({ color = '#8a4b14', label, h = 1.6, ...p }: JSX.IntrinsicElements['group'] & { color?: string; label?: THREE.Texture; h?: number }) {
  const glass = useMemo(
    () => lathe([[0, 0], [0.5, 0], [0.55, 0.06], [0.55, h * 0.72], [0.45, h * 0.82], [0.2, h * 0.9], [0.18, h], [0.0, h]], 64),
    [h],
  )
  return (
    <group {...p}>
      <mesh geometry={glass} castShadow>
        <meshPhysicalMaterial color={color} transmission={1} thickness={0.6} roughness={0.05} ior={1.5} attenuationColor={color} attenuationDistance={0.8} clearcoat={1} />
      </mesh>
      <mesh position={[0, h + 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.21, 0.28, 32]} />
        {brass}
      </mesh>
      {label && (
        <mesh position={[0, h * 0.38, 0]}>
          <cylinderGeometry args={[0.565, 0.565, h * 0.38, 64, 1, true, -Math.PI / 2.6, Math.PI / 1.3]} />
          <meshStandardMaterial map={label} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

export function Towel({ color = '#f3efe6', ...p }: JSX.IntrinsicElements['group'] & { color?: string }) {
  const end = useMemo(
    () =>
      canvasTex(256, 256, (c) => {
        c.fillStyle = color
        c.fillRect(0, 0, 256, 256)
        c.strokeStyle = 'rgba(0,0,0,.18)'
        for (let r = 8; r < 128; r += 9) {
          c.lineWidth = 2
          c.beginPath()
          c.arc(128 + r * 0.04, 128, r, 0, Math.PI * 2)
          c.stroke()
        }
      }),
    [color],
  )
  return (
    <group {...p}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 2, 48]} />
        <meshStandardMaterial attach="material-0" color={color} roughness={1} />
        <meshStandardMaterial attach="material-1" map={end} roughness={1} />
        <meshStandardMaterial attach="material-2" map={end} roughness={1} />
      </mesh>
    </group>
  )
}

export function Chair(p: JSX.IntrinsicElements['group']) {
  const leather = <meshPhysicalMaterial color="#6b1d1a" roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.3} />
  return (
    <group {...p}>
      {/* base */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.12, 64]} />
        {chrome}
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.2, 32]} />
        {chrome}
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.4, 0.25, 32]} />
        {chrome}
      </mesh>
      {/* assento */}
      <RoundedBox args={[1.9, 0.45, 1.8]} radius={0.18} smoothness={6} position={[0, 1.55, 0]} castShadow receiveShadow>
        {leather}
      </RoundedBox>
      {/* encosto */}
      <RoundedBox args={[1.8, 2.3, 0.4]} radius={0.18} smoothness={6} position={[0, 2.85, -0.85]} rotation={[-0.12, 0, 0]} castShadow>
        {leather}
      </RoundedBox>
      <RoundedBox args={[0.9, 0.45, 0.35]} radius={0.15} smoothness={6} position={[0, 4.25, -0.98]} rotation={[-0.12, 0, 0]} castShadow>
        {leather}
      </RoundedBox>
      <mesh position={[0, 3.95, -1.0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        {chrome}
      </mesh>
      {/* braços */}
      {[-1.1, 1.1].map((x) => (
        <group key={x}>
          <RoundedBox args={[0.35, 0.25, 1.9]} radius={0.1} position={[x, 2.25, 0.05]} castShadow>
            <meshPhysicalMaterial color="#1b1410" roughness={0.3} clearcoat={1} />
          </RoundedBox>
          <mesh position={[x, 1.95, 0.75]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.55, 16]} />
            {chrome}
          </mesh>
          <mesh position={[x, 1.95, -0.6]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.55, 16]} />
            {chrome}
          </mesh>
        </group>
      ))}
      {/* apoio de pés */}
      <mesh position={[0, 0.85, 1.45]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.06, 0.7]} />
        {chrome}
      </mesh>
      <mesh position={[0, 1.15, 1.15]} rotation={[Math.PI / 2 + 0.6, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 16]} />
        {chrome}
      </mesh>
    </group>
  )
}

export function Mirror({ w = 3, h = 4, ...p }: JSX.IntrinsicElements['group'] & { w?: number; h?: number }) {
  const frame = useMemo(() => {
    const rr = (s: THREE.Shape | THREE.Path, W: number, H: number, r: number) => {
      s.moveTo(-W / 2 + r, -H / 2)
      s.lineTo(W / 2 - r, -H / 2)
      s.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + r)
      s.lineTo(W / 2, H / 2 - r)
      s.quadraticCurveTo(W / 2, H / 2, W / 2 - r, H / 2)
      s.lineTo(-W / 2 + r, H / 2)
      s.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - r)
      s.lineTo(-W / 2, -H / 2 + r)
      s.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + r, -H / 2)
      return s
    }
    const s = rr(new THREE.Shape(), w + 0.4, h + 0.4, 0.6) as THREE.Shape
    s.holes.push(rr(new THREE.Path(), w, h, 0.45) as THREE.Path)
    return new THREE.ExtrudeGeometry(s, { depth: 0.15, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4, curveSegments: 24 })
  }, [w, h])
  return (
    <group {...p}>
      <mesh geometry={frame} castShadow>
        {brass}
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#3a4250" metalness={1} roughness={0.04} />
      </mesh>
    </group>
  )
}

/** Luzes desfocadas ao fundo (bokeh). */
export function Bokeh({ n = 40, z = -14, spread = 18, y = 3 }: { n?: number; z?: number; spread?: number; y?: number }) {
  const pts = useMemo(() => Array.from({ length: n }, () => [rnd(-spread, spread), rnd(y - 4, y + 6), z + rnd(-3, 3), rnd(0.08, 0.25), Math.random()] as const), [n, z, spread, y])
  return (
    <>
      {pts.map(([x, yy, zz, r, k], i) => (
        <mesh key={i} position={[x, yy, zz]}>
          <sphereGeometry args={[r, 12, 8]} />
          <meshBasicMaterial color={k < 0.75 ? '#ffb866' : k < 0.9 ? '#ffd9a8' : '#c0403a'} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}
