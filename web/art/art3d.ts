import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
// @ts-ignore
import vertexShader from '~/art/shader/art3d/vertexShader.vert'
// @ts-ignore
import fragmentShader from '~/art/shader/art3d/fragmentShader.frag'
import { MidiControls } from '~/types/dto'

export const Art3D = function () {
  const clock = new THREE.Clock()
  const scene = new THREE.Scene()
  const bgColor = new THREE.Color(0.8, 0.8, 0.688)
  scene.background = new THREE.Color(0.1, 0.1, 0.1)

  const MAX_AGE = 12
  const currentAge = MAX_AGE
  const duration = 12.0
  const PADDING = 0.0
  let geometry, mesh, material
  let analyser
  // let directionalLight

  // Audio visual factor
  let baseFrame = 20
  let zOffset = 0

  let index: any = []
  let vertices: any = []
  let uvs: any = []
  let indices: any = []
  let paddings: any = []
  let colors: any = []
  let size: any = []
  let directions: any = []
  let ratios: any = []
  let weights: any = []
  let cameraZOffset = 0

  let baseTile
  let totalRenderCount = 0
  let lastUpdatedTime = 0

  let currentArt = 0

  // For dev
  const currentTime = [0]
  let span = 0.01

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
    offset: { type: 'f', value: 1.0 },
    // 拡散色
    // diffuse: { type: 'c', value: new THREE.Color(0xffffff) },
    //
    // // 放射色
    // emissive: { type: 'c', value: new THREE.Color(0x000000) },
  }
  // @ts-ignore
  this.updateTexture = (path: string) => {
    createTexture(path)
  }

  // @ts-ignore
  this.updateNoteNumber = (note: number, controls: MidiControls) => {
    const getControlVal = (index: number) => {
      return controls.controls.get(index) || 0
    }
    span = getControlVal(0)
    baseFrame = (1 - getControlVal(1)) * 100
    mesh.rotation.x = (getControlVal(2) * 360 * Math.PI) / 180
    mesh.rotation.y = (getControlVal(3) * 360 * Math.PI) / 180
    mesh.rotation.z = (getControlVal(4) * 360 * Math.PI) / 180
    cameraZOffset = (1 - getControlVal(5)) * 500
    zOffset = getControlVal(6) * 500

    switch (note) {
      case 0: {
        if (currentArt !== 0) {
          createTexture('img/2.jpeg')
        }
        break
      }
      case 1: {
        if (currentArt !== 1) {
          createTexture('img/flower4.png')
        }
        break
      }
    }
    currentArt = note
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

  // const directionalLight = new THREE.DirectionalLight('#ffffff')
  // directionalLight.position.set(0, 80, 0)
  // directionalLight.intensity = 10
  // scene.add(directionalLight)
  //
  // const pointLight = new THREE.PointLight(0xffffff, 1, 5, 1)
  // pointLight.position.set(0, 0, 2.5)
  // scene.add(pointLight)
  //
  // // ヘルパー
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
  // scene.add(pointLightHelper)

  const renderer = new THREE.WebGLRenderer()
  document.body.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  console.log(controls)

  const render = () => {
    clock.getDelta()

    currentTime[0] = clock.elapsedTime

    uniforms.time.value = clock.elapsedTime

    if (analyser) {
      analyser.fftSize = 2048
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)
      // for (let i = 0; i < bufferLength; i++) {
      //   const barHeight = dataArray[i]
      //
      //   const r = barHeight + 25 * (i / bufferLength)
      //   const g = 250 * (i / bufferLength)
      //   const b = 50
      // }
      const index2 = 0
      const mmax = 155
      uniforms.offset.value = dataArray[index2] / mmax
      if (baseTile) {
        baseTile.updateZ((dataArray[index2] / mmax) * zOffset)
      }
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
      mesh.rotateZ(((360 * Math.PI) / 180 / (duration / span)) * 0.5)
    }

    const z = stageHeight / Math.tan((fov * Math.PI) / 360) / 2
    camera.position.z = z + cameraZOffset

    renderer.render(scene, camera)

    requestAnimationFrame(render)
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
      // uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.lights, uniforms]),
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: true,
      wireframe: false,
      side: THREE.DoubleSide,
      glslVersion: THREE.GLSL1,
      // lights: false,
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

  let colorArray: any = []
  let textureImageSize = {
    w: 0,
    h: 0,
  }

  const createTexture = (texturePath: string) => {
    new THREE.TextureLoader().load(texturePath, (texture) => {
      ;(uniforms.texture as any).value = texture
      uniforms.textureResolution.value = new THREE.Vector2(
        texture.image.width,
        texture.image.height
      )

      const canvas = document.createElement('canvas')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const context: any = canvas.getContext('2d')
      context.beginPath()
      context.fillStyle = 'rgb(255, 255, 255)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      // Draw image on center
      context.drawImage(
        texture.image,
        canvas.width / 2 - texture.image.width / 2,
        canvas.height / 2 - texture.image.height / 2
      )

      const data = context.getImageData(0, 0, canvas.width, canvas.height)
      const colors = data.data
      colorArray = []
      for (let i = 0; i < colors.length; i += 4) {
        colorArray.push({
          r: colors[i],
          g: colors[i + 1],
          b: colors[i + 2],
          a: colors[i + 3],
        })
      }
      textureImageSize = {
        w: canvas.width,
        h: canvas.height,
      }

      createTiles()
    })
  }

  const initTiles = () => {
    createTexture('img/gundam.png')
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
      this.z = Math.random() * 20
      this.originalZ = this.z
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
      this.maxFrame = Math.floor(Math.random() * 100)
      this.easing = easings[1]

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

    updateZ(z) {
      this.additionalZ = z
      if (this.children.length > 0) {
        this.children[0].updateZ(z)
        this.children[1].updateZ(z)
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
        if (ratioDiff < 0.0001) {
          this.frame = 0
          this.targetRatio = map(Math.random(), 0.0, 1.0, 0.0, 1.0)
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
        this.ratio = Math.max(Math.min(this.ratio, 1.0), 0.0)
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
        // this.z =
        //   this.originalZ * Math.min(this.easing(currentTime[0] / 1.2), 1.0)
        this.z = this.originalZ + this.additionalZ
        this.draw(true)
      }
    }

    getPositionAndSize(faceIndex, vertexIndex) {
      let x, y, z
      let w, h
      switch (faceIndex) {
        case 0: {
          // front
          x =
            vertexIndex === 0 || vertexIndex === 3
              ? this.x + PADDING
              : this.x + this.w - PADDING
          y =
            vertexIndex === 0 || vertexIndex === 1
              ? this.y + PADDING
              : this.y + this.h - PADDING
          z = this.z
          w = this.w - PADDING * 2
          h = this.h - PADDING * 2
          break
        }
        case 1: {
          // right
          x = this.x + this.w - PADDING
          y =
            vertexIndex === 0 || vertexIndex === 1
              ? this.y + PADDING
              : this.y + this.h - PADDING
          z = vertexIndex === 0 || vertexIndex === 3 ? this.z : 0
          w = this.z
          h = this.h - PADDING * 2
          break
        }
        case 2: {
          // back
          x =
            vertexIndex === 0 || vertexIndex === 3
              ? this.x + PADDING
              : this.x + this.w - PADDING
          y =
            vertexIndex === 0 || vertexIndex === 1
              ? this.y + PADDING
              : this.y + this.h - PADDING
          z = 0
          w = this.w - PADDING * 2
          h = this.h - PADDING * 2
          break
        }
        case 3: {
          // left
          x = this.x + PADDING
          y =
            vertexIndex === 0 || vertexIndex === 1
              ? this.y + PADDING
              : this.y + this.h - PADDING
          z = vertexIndex === 0 || vertexIndex === 3 ? 0 : this.z
          w = this.z
          h = this.h - PADDING * 2
          break
        }
        case 4: {
          // top
          x =
            vertexIndex === 0 || vertexIndex === 3
              ? this.x + PADDING
              : this.x + this.w - PADDING
          y = this.y + this.h - PADDING
          z = vertexIndex === 0 || vertexIndex === 1 ? this.z : 0
          w = this.w - PADDING * 2
          h = this.z
          break
        }
        case 5: {
          // bottom
          x =
            vertexIndex === 0 || vertexIndex === 3
              ? this.x + PADDING
              : this.x + this.w - PADDING
          y = this.y + PADDING
          z = vertexIndex === 0 || vertexIndex === 1 ? this.z : 0
          w = this.w - PADDING * 2
          h = this.z
          break
        }
      }
      return {
        x,
        y,
        z,
        w,
        h,
      }
    }

    draw(shouldUpdate = false) {
      this.shouldRender = true

      if (shouldUpdate) {
        // Update
        const screenPos = this.getScreenPosition()

        for (let k = 0; k < 6; k++) {
          for (let j = 0; j < 4; j++) {
            const targetIndex = this.id * 6 * 4 + k * 4 + j

            const position = geometry.attributes.position
            const { x, y, z, w, h } = this.getPositionAndSize(k, j)
            position.setXYZ(targetIndex, x, y, z)
            position.needsUpdate = true

            const size = geometry.attributes.size
            size.setXY(targetIndex, w, h)
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
        }
      } else {
        // Initial
        this.id = totalRenderCount
        const screenPos = this.getScreenPosition()
        const screenPos2 = this.getScreenPosition2()

        const c =
          Math.floor(textureImageSize.h - screenPos2.y) * textureImageSize.w +
          Math.floor(screenPos2.x)
        const ca = colorArray[c]
        let color = {
          r: 0,
          g: 0,
          b: 0,
        }
        this.z = 0
        if (ca) {
          color = {
            r: ca.r / 255,
            g: ca.g / 255,
            b: ca.b / 255,
          }
          const grayColor = (color.r + color.g + color.b) / 3
          this.z += Math.min((1 / map(grayColor, 0.0, 1.0, 0.1, 2)) * 150, 500)
          this.originalZ = this.z
          cameraZOffset = Math.max(cameraZOffset, this.z)
        }

        for (let k = 0; k < 6; k++) {
          for (let j = 0; j < 4; j++) {
            const { x, y, z, w, h } = this.getPositionAndSize(k, j)
            vertices.push(x, y, z)
            size.push(w, h)
            directions.push(this.getDirection())
            ratios.push(this.ratio)
            weights.push(screenPos.x, screenPos.y)
          }

          for (let j = 0; j < 4; j++) {
            index.push(this.id)
            paddings.push(PADDING, PADDING)
            colors.push(color.r, color.g, color.b)
          }

          uvs.push(0, 0, 1, 0, 1, 1, 0, 1)

          // polygon order
          // 3 -- 2
          // |    |
          // 0 -- 1
          const vertexIndex = this.id * 6 * 4 + k * 4
          indices.push(
            vertexIndex + 0,
            vertexIndex + 1,
            vertexIndex + 2,
            vertexIndex + 2,
            vertexIndex + 3,
            vertexIndex + 0
          )
        }

        totalRenderCount++
      }
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

    getScreenPosition2() {
      const centerOfTile = {
        x: this.x + this.w / 2,
        y: this.y + this.h / 2,
      }
      const w = window.innerWidth
      const h = stageHeight
      return {
        // x: (centerOfTile.x) / w,
        // y: (centerOfTile.y) / h
        x: centerOfTile.x + w / 2,
        y: centerOfTile.y + h / 2,
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

  // const easeOutExpo = (x) => {
  //   return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  // }

  const easeInCirc = (x) => {
    return 1 - Math.sqrt(1 - Math.pow(x, 2))
  }

  const easeInExpo = (x) => {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10)
  }

  const easings = [
    easeInCirc,
    easeInExpo,
    easeOutBack,
    easeOutBounce,
    easeOutElastic,
  ]

  window.addEventListener('resize', onResize)

  const initAudioInterface = async () => {
    const audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    let deviceId = `cbe8cb7e553c528305ac583d576b9feaa579437bde983a73704284d55c2e99c4`
    deviceId =
      '82223ad0b0eb2738589395f1afdd096721451a542fdaeee3136d03d110b447a4'
    deviceId = ''
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log(devices)
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].label.includes('Steinberg UR22mkII')) {
        deviceId = devices[i].deviceId
        break
      }
    }
    const audio = deviceId ? { deviceId: { exact: deviceId } } : true
    const stream = await navigator.mediaDevices.getUserMedia({ audio })
    const source = audioCtx.createMediaStreamSource(stream)
    source.connect(analyser)
  }

  const init = async () => {
    await initAudioInterface()
    initTiles()
    onResize()
    render()
  }

  let isInitialized = false
  window.addEventListener('click', () => {
    if (!isInitialized) {
      init()
      isInitialized = true
    }
  })
}
