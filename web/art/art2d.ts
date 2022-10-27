import * as THREE from 'three'
// import OrbitControls from 'three-orbitcontrols'
// @ts-ignore
import vertexShader from '~/art/shader/art2d/vertexShader.vert'
// @ts-ignore
import fragmentShader from '~/art/shader/art2d/fragmentShader.frag'
import { MidiControls } from '~/types/dto'

export const Art2D = function () {
  const clock = new THREE.Clock()
  const scene = new THREE.Scene()
  const bgColor = new THREE.Color(0.0, 0.0, 0.0)
  scene.background = bgColor

  const text = '🌊'
  const MAX_AGE = 14
  const currentAge = MAX_AGE
  // const duration = 12.0
  const PADDING = 0.0
  let geometry, mesh, material, texture
  let analyser
  let currentArt = 0

  // Audio visual factor
  let baseFrame = 20
  // let zOffset = 0
  let colorR = 0
  let colorG = 0
  let colorB = 0
  let span = 0

  let index: any = []
  let vertices: any = []
  let uvs: any = []
  let offsets: any = []
  let indices: any = []
  let paddings: any = []
  let colors: any = []
  let size: any = []
  let directions: any = []
  let ratios: any = []
  let weights: any = []

  let baseTile
  let totalRenderCount = 0
  let lastUpdatedTime = 0

  let frameID

  // For dev
  const currentTime = [0]
  // let imageIndex = 0
  // const span = 0.01
  // const timeoutSpan = 100

  const uniforms = {
    time: { type: 'f', value: 1.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() },
    texture: { type: 't', value: null },
    textureResolution: { type: 'v2', value: new THREE.Vector2() },
    textureBlockSize: { type: 'f', value: 1.0 },
    bgColor: {
      type: 'v3',
      value: new THREE.Vector3(bgColor.r, bgColor.g, bgColor.b),
    },
  }

  // @ts-ignore
  this.setAnalyser = (_analyser: any) => {
    analyser = _analyser
  }

  // @ts-ignore
  this.updateTexture = (_path: string) => {
    // createTexture(path)
  }

  // @ts-ignore
  this.updateNoteNumber = (
    note: number,
    currentControlNumber: number,
    controls: MidiControls
  ) => {
    const getControlVal = (index: number) => {
      return controls.controls.get(index) || 0
    }

    switch (currentControlNumber) {
      case 0: {
        span = getControlVal(currentControlNumber)
        break
      }
      case 1: {
        baseFrame = (1 - getControlVal(currentControlNumber)) * 200
        break
      }
      case 2: {
        // mesh.rotation.x =
        //   (getControlVal(currentControlNumber) * 360 * Math.PI) / 180
        break
      }
      case 3: {
        // mesh.rotation.y =
        //   (getControlVal(currentControlNumber) * 360 * Math.PI) / 180
        break
      }
      case 4: {
        // mesh.rotation.z =
        //   (getControlVal(currentControlNumber) * 360 * Math.PI) / 180
        break
      }
      case 5: {
        // cameraZOffset = (1 - getControlVal(currentControlNumber)) * 500
        break
      }
      case 6: {
        // zOffset = getControlVal(currentControlNumber) * 500
        break
      }
      case 21: {
        colorR = getControlVal(currentControlNumber)
        break
      }
      case 22: {
        colorG = getControlVal(currentControlNumber)
        break
      }
      case 23: {
        colorB = getControlVal(currentControlNumber)
        break
      }
    }
    //
    switch (note) {
      case 0: {
        if (currentArt !== 0) {
          createTextTexture(1, '🐙', new THREE.Color(0.0, 0.0, 1.0))
        }
        break
      }
      case 1: {
        if (currentArt !== 1) {
          createTextTexture(1, '🚀', new THREE.Color(0.0, 1.0, 0.0))
        }
        break
      }
    }
    currentArt = note
    console.log(currentArt)
  }

  // @ts-ignore
  this.dispose = () => {
    scene.remove(mesh)
    mesh.material.dispose()
    mesh.geometry.dispose()
    texture.dispose()
    cancelAnimationFrame(frameID)
  }

  const map = (value, beforeMin, beforeMax, afterMin, afterMax) => {
    return (
      afterMin +
      (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin))
    )
  }

  // Camera
  const fov = 45
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(fov, aspect, 1, 10000)
  const stageHeight = window.innerHeight
  // Make camera distance same as actual pixel value.
  const z = stageHeight / Math.tan((fov * Math.PI) / 360) / 2
  camera.position.z = z

  const renderer = new THREE.WebGLRenderer()
  document.body.appendChild(renderer.domElement)

  const render = () => {
    clock.getDelta()

    currentTime[0] = clock.elapsedTime

    uniforms.time.value = currentTime[0]

    if (analyser) {
      analyser.fftSize = 2048
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      const index2 = 0
      const mmax = 155
      const v = Math.pow(dataArray[index2] / mmax, 3)
      scene.background = new THREE.Color(
        colorR === 0 ? v : colorR,
        colorG === 0 ? v : colorG,
        colorB === 0 ? v : colorB
      )
    }

    if (baseTile) {
      baseTile.update()

      const sec = Math.floor(currentTime[0])
      if (sec === 0 || (sec !== lastUpdatedTime && sec % 8 === 0)) {
        baseTile.updateTarget(0.5)
        lastUpdatedTime = sec
      }
    }

    if (mesh) {
      if (span === 0) {
        mesh.rotation.z = 0
      } else {
        mesh.rotateZ(span)
      }
    }

    camera.lookAt(new THREE.Vector3(0, 0, 0))
    renderer.render(scene, camera)

    frameID = requestAnimationFrame(render)
  }

  const onResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    setSize(width, height)
  }

  const setSize = (width, height) => {
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    uniforms.resolution.value = new THREE.Vector2(width, height)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
  }

  const addTilesToScene = () => {
    geometry = new THREE.BufferGeometry()
    geometry.setIndex(indices)
    geometry.setAttribute('index', new THREE.Uint16BufferAttribute(index, 1))
    geometry.setAttribute(
      'totalIndex',
      new THREE.Float32BufferAttribute(
        [...Array(index.length)].map((_, _index) => totalRenderCount),
        1
      )
    )
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    geometry.setAttribute('uv', new THREE.Uint16BufferAttribute(uvs, 2))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 2))
    geometry.setAttribute(
      'offset',
      new THREE.Float32BufferAttribute(offsets, 2)
    )
    geometry.setAttribute(
      'padding',
      new THREE.Float32BufferAttribute(paddings, 2)
    )
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute(
      'direction',
      new THREE.Float32BufferAttribute(directions, 1)
    )
    geometry.setAttribute('ratio', new THREE.Float32BufferAttribute(ratios, 1))
    geometry.setAttribute(
      'weight',
      new THREE.Float32BufferAttribute(weights, 2)
    )

    material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: true,
      wireframe: false,
      glslVersion: THREE.GLSL1,
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  }

  const createTiles = () => {
    totalRenderCount = 0
    scene.clear()

    index = []
    vertices = []
    uvs = []
    offsets = []
    indices = []
    paddings = []
    colors = []
    size = []
    directions = []
    ratios = []
    weights = []

    baseTile = new Tile(
      -window.innerWidth / 2,
      -stageHeight / 2,
      window.innerWidth,
      stageHeight,
      0
    )

    addTilesToScene()
  }

  const createTextTexture = (type = 1, originalText = '', _bgColor) => {
    const textNum = 1
    const textSize = 200

    const _originalText = Array.from(originalText).slice(0, textNum * textNum)

    while (_originalText.length < textNum * textNum) {
      _originalText.push('　')
    }
    console.log(_originalText)

    const canvas = document.createElement('canvas')
    canvas.width = textNum * textSize
    canvas.height = textNum * textSize

    const ctx: any = canvas.getContext('2d')
    ctx.font = `${textSize * 0.8}px 'Arial'`
    ctx.fillStyle = `#${_bgColor.getHexString()}`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < _originalText.length; i++) {
      const x = (i % textNum) * textSize + textSize / 2
      const y = Math.floor(i / textNum) * textSize + textSize / 2
      ctx.fillText(_originalText[i], x, y)
    }

    if (texture) {
      texture.dispose()
    }
    texture = new THREE.Texture(canvas)
    texture.needsUpdate = true

    uniforms.textureResolution.value = new THREE.Vector2(
      canvas.width,
      canvas.height
    )
    uniforms.textureBlockSize.value = textNum

    switch (type) {
      case 1: {
        uniforms.texture.value = texture
        break
      }
    }
    scene.background = _bgColor
    uniforms.bgColor.value = new THREE.Vector3(
      _bgColor.r,
      _bgColor.g,
      _bgColor.b
    )
  }

  const initTiles = () => {
    createTiles()
    createTextTexture(1, text, new THREE.Color(0.0, 0.0, 0.0))
  }

  class Tile {
    private x: number = 0
    private y: number = 0
    private z: number = 0
    private originalZ = this.z
    private additionalZ = 0
    private w: number = 0
    private h: number = 0
    private age: number = 0
    private children: any = []
    private offset: number = 0
    private ratio: number = 0
    private lastRatio: number = 0
    private targetRatio: number = 0
    private shouldRender: boolean = false
    private id = 0
    private impulse = 0
    private updateCount = 0
    private frame = 0
    private maxFrame = 0
    private easing = easings[1]

    constructor(x, y, w, h, age) {
      this.x = x
      this.y = y
      this.w = w
      this.h = h
      this.age = age
      this.children = []
      this.offset = Math.floor(Math.random() * 50 + 1)
      this.ratio = 0.5 + (Math.random() * 2.0 - 1.0) * 0.1
      this.ratio = 0.5
      this.lastRatio = this.ratio
      this.targetRatio = this.ratio
      this.shouldRender = false
      this.id = -1
      this.impulse = 0
      this.updateCount = 0
      this.frame = 0
      this.maxFrame = 10 + Math.floor(Math.random() * 100)
      this.easing = easeOutExpo
      if (this.age > 1) {
        this.easing = easings[Math.floor(Math.random() * easings.length)]
      }

      if (this.age < currentAge) {
        const nextAge = this.age + 1
        if (this.age % 2 === 0) {
          // horizontal
          // ||
          const w1 = this.w * this.ratio
          const w2 = this.w * (1 - this.ratio)
          this.children[0] = new Tile(this.x, this.y, w1, this.h, nextAge)
          this.children[1] = new Tile(this.x + w1, this.y, w2, this.h, nextAge)
        } else {
          // vertical
          // ＝
          const h1 = this.h * this.ratio
          const h2 = this.h * (1 - this.ratio)
          this.children[0] = new Tile(this.x, this.y, this.w, h1, nextAge)
          this.children[1] = new Tile(this.x, this.y + h1, this.w, h2, nextAge)
        }
      } else {
        // for render
        this.draw(false)
      }
    }

    updateTarget(ratio) {
      if (this.children.length > 0) {
        this.frame = 0
        this.lastRatio = this.ratio
        this.targetRatio = ratio || Math.random()
        const _ratio = ratio || null
        this.children[0].updateTarget(_ratio)
        this.children[1].updateTarget(_ratio)
      }
    }

    update(arg: any = null) {
      if (arg) {
        this.x = arg.x
        this.y = arg.y
        this.w = arg.w
        this.h = arg.h
        this.impulse = arg.impulse
      }
      if (this.children.length > 0) {
        let ratioDiff = Math.abs(this.ratio - this.targetRatio)
        if (ratioDiff <= 0.0) {
          this.frame = 0
          this.targetRatio = Math.random()
          this.updateCount++
          this.lastRatio = this.ratio
        }
        if (ratioDiff < 0.005) {
          ratioDiff = 0
        }
        this.ratio = map(
          this.easing(Math.min(this.frame / (baseFrame + this.maxFrame), 1)) *
            this.targetRatio,
          0,
          this.targetRatio,
          this.lastRatio,
          this.targetRatio
        )
        this.ratio = Math.max(Math.min(this.ratio, 1), 0)
        this.frame++

        if (this.age % 2 === 0) {
          // horizontal
          // ||
          const x1 = this.x
          const y1 = this.y
          const w1 = this.w * this.ratio
          const h1 = this.h
          this.children[0].update({
            x: x1,
            y: y1,
            w: w1,
            h: h1,
            impulse: ratioDiff,
          })

          const x2 = x1 + w1
          const y2 = y1
          const w2 = this.w * (1 - this.ratio)
          const h2 = this.h
          this.children[1].update({
            x: x2,
            y: y2,
            w: w2,
            h: h2,
            impulse: ratioDiff,
          })
        } else {
          // vertical
          // ＝
          const x1 = this.x
          const y1 = this.y
          const w1 = this.w
          const h1 = this.h * this.ratio
          this.children[0].update({
            x: x1,
            y: y1,
            w: w1,
            h: h1,
            impulse: ratioDiff,
          })

          const x2 = this.x
          const y2 = this.y + h1
          const w2 = this.w
          const h2 = this.h * (1 - this.ratio)
          this.children[1].update({
            x: x2,
            y: y2,
            w: w2,
            h: h2,
            impulse: ratioDiff,
          })
        }
      } else {
        // render
        this.draw(true)
      }
    }

    draw(shouldUpdate = false) {
      this.shouldRender = true

      if (shouldUpdate) {
        // Update
        const screenPos = this.getScreenPosition()

        for (let j = 0; j < 4; j++) {
          const targetIndex = this.id * 4 + j

          const position = geometry.attributes.position
          position.setXYZ(targetIndex, this.x, this.y, 0)
          position.needsUpdate = true

          const size = geometry.attributes.size
          size.setXY(targetIndex, this.w, this.h)
          size.needsUpdate = true

          const ratio = geometry.attributes.ratio
          ratio.setX(targetIndex, this.impulse)
          ratio.needsUpdate = true

          const direction = geometry.attributes.direction
          direction.setX(targetIndex, this.getDirection())
          direction.needsUpdate = true

          const weight = geometry.attributes.weight
          weight.setXY(targetIndex, screenPos.x, screenPos.y)
          weight.needsUpdate = true
        }
      } else {
        // Initial
        this.id = totalRenderCount
        const screenPos = this.getScreenPosition()

        for (let j = 0; j < 4; j++) {
          vertices.push(this.x, this.y, 0)
          size.push(this.w, this.h)
          directions.push(this.getDirection())
          ratios.push(this.ratio)
          weights.push(screenPos.x, screenPos.y)
        }

        const color = {
          x: map(Math.random(), 0.0, 1.0, 0.7, 0.8),
          y: map(Math.random(), 0.0, 1.0, 0.1, 0.3),
          z: map(Math.random(), 0.0, 1.0, 0.1, 0.3),
        }

        for (let j = 0; j < 4; j++) {
          index.push(this.id)
          paddings.push(PADDING, PADDING)
          colors.push(color.x, color.y, color.z)
        }

        uvs.push(0, 0, 1, 0, 1, 1, 0, 1)
        // offsets.push(
        //     -1, -1,
        //     1, -1,
        //     1, 1,
        //     -1, 1
        // );
        offsets.push(0, 0, 1, 0, 1, 1, 0, 1)

        // polygon order
        // 3 -- 2
        // |    |
        // 0 -- 1
        const vertexIndex = this.id * 4
        indices.push(
          vertexIndex + 0,
          vertexIndex + 1,
          vertexIndex + 2,
          vertexIndex + 2,
          vertexIndex + 3,
          vertexIndex + 0
        )

        totalRenderCount++
      }

      // console.log(`for render: x: ${this.x}, y: ${this.y}, w: ${this.w}, h: ${this.h}`);
    }

    getDirection() {
      if (Math.abs(this.w - this.h) < 100.0) {
        return -1.0
      } else if (this.w > this.h) {
        return 1.0
      } else {
        return 0.0
      }
    }

    getCenter() {
      return {
        x: this.x + this.w / 2,
        y: this.y + this.h / 2,
      }
    }

    getScreenPosition() {
      const centerOfTile = this.getCenter()
      const w = window.innerWidth
      const h = stageHeight
      return {
        // x: (centerOfTile.x) / w,
        // y: (centerOfTile.y) / h
        x: (centerOfTile.x + w / 2) / w,
        y: (centerOfTile.y + h / 2) / h,
      }
    }
  }

  const easeOutElastic = (x) => {
    let t = x
    const b = 0.0
    const c = 1.0
    const d = 1.0
    let s = 1.70158
    let p = 0.0
    let a = c
    if (t === 0.0) return b
    if ((t /= d) === 1.0) return b + c
    if (p === 0.0) p = d * 0.3
    if (a < Math.abs(c)) {
      a = c
      s = p / 4.0
    } else s = (p / (2.0 * 3.14159265359)) * Math.asin(c / a)
    return (
      a *
        Math.pow(2.0, -10.0 * t) *
        Math.sin(((t * d - s) * (2.0 * 3.14159265359)) / p) +
      c +
      b
    )
  }

  const easeOutBounce = (x) => {
    const n1 = 7.5625
    const d1 = 2.75

    if (x < 1 / d1) {
      return n1 * x * x
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375
    }
  }

  const easeOutBack = (x) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
  }

  const easeOutExpo = (x) => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  }

  const easeInCirc = (x) => {
    return 1 - Math.sqrt(1 - Math.pow(x, 2))
  }

  const easings = [
    easeInCirc,
    easeOutExpo,
    easeOutBack,
    easeOutBounce,
    easeOutElastic,
  ]

  window.addEventListener('resize', onResize)

  initTiles()
  onResize()
  render()
}
