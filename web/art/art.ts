import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
// @ts-ignore
import vertexShader from '~/art/shader/vertexShader.vert'
// @ts-ignore
import fragmentShader1 from '~/art/shader/fragmentShader1.frag'
// @ts-ignore
import fragmentShader2 from '~/art/shader/fragmentShader2.frag'
import { MidiControls } from '~/types/dto'

export const Art = function () {
  const clock = new THREE.Clock()
  const scene = new THREE.Scene()

  const PADDING = 0.0
  const SHADER_QUALITY = 0.5

  let geometry, mesh
  let material
  const vertices: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const paddings: number[] = []
  const size: number[] = []

  const uniforms = {
    // Second
    time: { type: 'f', value: 1.0 },
    offset: { type: 'f', value: 1.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() },
  }

  // @ts-ignore
  this.updateNoteNumber = (note: number, controls: MidiControls) => {
    switch (note) {
      case 0: {
        uniforms.offset.value = controls.controls.get(0) || 0
        material.fragmentShader = fragmentShader1
        material.needsUpdate = true
        break
      }
      case 1: {
        uniforms.offset.value = controls.controls.get(0) || 0
        material.fragmentShader = fragmentShader2
        material.needsUpdate = true
        break
      }
    }
  }

  const getWindowSize = () => {
    return {
      w: window.innerWidth,
      h: window.innerHeight,
    }
  }

  // Camera
  const fov = 45
  const aspect = getWindowSize().w / getWindowSize().h
  const camera = new THREE.PerspectiveCamera(fov, aspect, 1, 10000)
  const stageHeight = getWindowSize().h
  // Make camera distance same as actual pixel value.
  const z = stageHeight / Math.tan((fov * Math.PI) / 360) / 2
  camera.position.z = z

  const canvas: HTMLCanvasElement = document.getElementById(
    'canvas'
  ) as HTMLCanvasElement
  const renderer = new THREE.WebGLRenderer({
    canvas,
  })

  const controls = new OrbitControls(camera, renderer.domElement)
  console.log(controls)

  const render = () => {
    clock.getDelta()

    uniforms.time.value = clock.elapsedTime

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  const onResize = () => {
    const width = getWindowSize().w
    const height = getWindowSize().h

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    uniforms.resolution.value = new THREE.Vector2(width, height)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width * SHADER_QUALITY, height * SHADER_QUALITY, false)
  }

  const getPositionAndSize = (vertexIndex) => {
    const windowSize = getWindowSize()
    const w = windowSize.w - PADDING * 2
    const h = windowSize.h - PADDING * 2
    const originX = -windowSize.w / 2
    const originY = -windowSize.h / 2
    const x =
      vertexIndex === 0 || vertexIndex === 3
        ? originX + PADDING
        : originX + PADDING + w
    const y =
      vertexIndex === 0 || vertexIndex === 1
        ? originY + PADDING
        : originY + PADDING + h
    const z = 0

    return {
      x,
      y,
      z,
      w,
      h,
    }
  }

  const init = () => {
    for (let j = 0; j < 4; j++) {
      const { x, y, z, w, h } = getPositionAndSize(j)
      vertices.push(x, y, z)
      size.push(w, h)
    }

    for (let j = 0; j < 4; j++) {
      paddings.push(PADDING, PADDING)
    }

    uvs.push(0, 0, 1, 0, 1, 1, 0, 1)

    // polygon order
    // 3 -- 2
    // |    |
    // 0 -- 1
    const vertexIndex = 0
    indices.push(
      vertexIndex + 0,
      vertexIndex + 1,
      vertexIndex + 2,
      vertexIndex + 2,
      vertexIndex + 3,
      vertexIndex + 0
    )

    geometry = new THREE.BufferGeometry()
    geometry.setIndex(indices)
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    geometry.setAttribute('uv', new THREE.Uint16BufferAttribute(uvs, 2))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 2))
    geometry.setAttribute(
      'padding',
      new THREE.Float32BufferAttribute(paddings, 2)
    )

    material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: fragmentShader1,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: true,
      wireframe: false,
      side: THREE.DoubleSide,
      glslVersion: THREE.GLSL1,
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    render()

    window.addEventListener('resize', onResize)
  }

  init()
  onResize()
}
