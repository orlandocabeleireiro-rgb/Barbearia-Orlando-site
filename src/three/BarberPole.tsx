import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createStripeMaterial } from './poleShader'

const BRASS = '#B8925A'

/** Perfil torneado dos topos em latão (LatheGeometry). */
function capProfile(flip: boolean) {
  const pts: [number, number][] = [
    [0.0, 0.0], [0.5, 0.0], [0.52, 0.03], [0.52, 0.09], [0.46, 0.12], [0.44, 0.17],
    [0.5, 0.21], [0.5, 0.25], [0.38, 0.29], [0.3, 0.36], [0.26, 0.44], [0.27, 0.5],
    [0.21, 0.56], [0.15, 0.6], [0.16, 0.66], [0.22, 0.7], [0.23, 0.76], [0.17, 0.83], [0.08, 0.88], [0.0, 0.9],
  ]
  return pts.map(([x, y]) => new THREE.Vector2(x, flip ? -y : y))
}

type Props = { quality: 'high' | 'low'; spin?: number }

export function BarberPole({ quality, spin = 1 }: Props) {
  const stripes = useMemo(createStripeMaterial, [])
  const group = useRef<THREE.Group>(null)
  const topGeo = useMemo(() => new THREE.LatheGeometry(capProfile(false), quality === 'high' ? 64 : 32), [quality])
  const botGeo = useMemo(() => new THREE.LatheGeometry(capProfile(true), quality === 'high' ? 64 : 32), [quality])

  useFrame((_, dt) => {
    stripes.uniforms.uTime.value += dt * spin
  })

  const H = 3.2
  return (
    <group ref={group}>
      {/* cilindro interior com as riscas */}
      <mesh material={stripes}>
        <cylinderGeometry args={[0.36, 0.36, H, quality === 'high' ? 96 : 48, 1, true]} />
      </mesh>

      {/* vidro: material físico com transmissão (desktop) ou vidro leve (telemóvel) */}
      <mesh>
        <cylinderGeometry args={[0.46, 0.46, H + 0.02, quality === 'high' ? 96 : 48, 1, true]} />
        {quality === 'high' ? (
          <meshPhysicalMaterial
            transmission={1}
            thickness={0.35}
            roughness={0.04}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.4}
            color="#fff7ea"
            attenuationColor="#f3e2c2"
            attenuationDistance={3}
            specularIntensity={1}
            side={THREE.FrontSide}
          />
        ) : (
          <meshPhysicalMaterial
            transparent
            opacity={0.18}
            roughness={0.05}
            clearcoat={1}
            envMapIntensity={1.6}
            color="#ffffff"
            depthWrite={false}
          />
        )}
      </mesh>

      {/* topos em latão */}
      <mesh geometry={topGeo} position={[0, H / 2, 0]}>
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.22} envMapIntensity={1.3} />
      </mesh>
      <mesh geometry={botGeo} position={[0, -H / 2, 0]}>
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.22} envMapIntensity={1.3} />
      </mesh>
      {/* esfera de remate no topo */}
      <mesh position={[0, H / 2 + 0.98, 0]}>
        <sphereGeometry args={[0.12, 32, 16]} />
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.18} />
      </mesh>
    </group>
  )
}
