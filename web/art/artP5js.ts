import p5 from 'p5'
import { P5Art } from '~/art/p5/_base'
import { Ball } from '~/art/p5/ball'
import { Feature } from '~/art/p5/feature'
import { MidiControls } from '~/types/dto'

let hash
let feature
let art: P5Art

const randomHash = () => {
  let result = '0x'
  for (let i = 0; i < 64; i++) {
    result += Math.floor(Math.random() * 16).toString(16)
  }
  return result
}

export class ArtP5 {
  private canvasParentID: string
  // @ts-ignore
  private p: p5
  private imagePath: string = 'img/flower4.png'
  private analyser: any

  constructor(canvasParentID: string) {
    this.canvasParentID = canvasParentID
  }

  setAnalyser(_analyser: any) {
    this.analyser = _analyser

    if (art) {
      art.setAnalyser(_analyser)
    }
  }

  updateTexture(_path: string) {
    // no-op
  }

  updateNoteNumber(
    note: number,
    currentControlNumber: number,
    controls: MidiControls
  ) {
    const getControlVal = (index: number) => {
      return controls.controls.get(index) || 0
    }

    switch (currentControlNumber) {
      case 0: {
        if (art) {
          ;(art as any).updateSpeed(
            1 + 10 * getControlVal(currentControlNumber)
          )
        }
        break
      }
    }
  }

  async create(_path: string = '') {
    if (_path) {
      this.imagePath = _path
    }

    if (!this.p) {
      // Error happens unless p5 is imported here.
      const { default: P5 } = await import('p5')
      // eslint-disable-next-line no-new
      new P5((p: p5) => {
        this.init(p)
      })
    } else {
      this.init(this.p)
    }
  }

  init(p: p5) {
    this.p = p
    hash = randomHash()
    feature = new Feature(hash)

    art = new Ball(p, feature)

    p.preload = () => {
      art.preload(this.imagePath)
    }
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent(this.canvasParentID)
      art.setup()
    }
    p.draw = () => {
      art.draw()
    }

    if (this.analyser) {
      art.setAnalyser(this.analyser)
    }
  }
}
