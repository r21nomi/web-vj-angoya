import p5 from 'p5'
import { Base, P5Art } from '~/art/p5/_base'
import { util } from '~/art/p5/util'

let mainGraphics
let speedOffset = 1

export class Ball extends Base implements P5Art {
  private balls: ABall[] = []

  constructor(p: p5, feature: any) {
    super(p, feature)
  }

  setup() {
    const p = this.p

    for (let i = 0; i < 6; i++) {
      this.balls.push(
        new ABall(
          p.createVector(p.width / 2, p.height / 2),
          p.createVector(util.shuffle([1, -1])[0], util.shuffle([1, -1])[0]),
          p.createVector(p.random(1, 10), p.random(1, 10)),
          10
        )
      )
    }

    p.background(this.feature.getBackgroundColor(false))

    mainGraphics = p.createGraphics(p.width, p.height)

    this.createImageGraphic()
  }

  updateSpeed(speed) {
    speedOffset = speed
  }

  draw() {
    const p = this.p

    let v = 1
    if (this.analyser) {
      this.analyser.fftSize = 2048
      const bufferLength = this.analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      this.analyser.getByteFrequencyData(dataArray)
      // for (let i = 0; i < bufferLength; i++) {
      //   const barHeight = dataArray[i]
      //
      //   const r = barHeight + 25 * (i / bufferLength)
      //   const g = 250 * (i / bufferLength)
      //   const b = 50
      // }
      const index2 = 0
      const mmax = 155
      v = Math.max(Math.pow(2 * (dataArray[index2] / mmax), 3), 0.5)
      // console.log(`v: ${v}`)
    }

    const padding = this.getPadding(mainGraphics)

    this.balls.forEach((ball) => {
      mainGraphics.strokeWeight(0.9)

      ball.update(
        p,
        this.p.createVector(padding.x, padding.y),
        this.p.createVector(p.width - padding.x, p.height - padding.y)
      )
      const x = ball.pos.x
      const y = ball.pos.y

      const c = this.getColor(x, y)
      mainGraphics.fill(c)
      mainGraphics.ellipse(x, y, ball.diameter * v)

      p.image(mainGraphics, 0, 0)
    })
  }
}

class ABall {
  public pos: p5.Vector
  public originalDiameter: number
  public diameter: number
  public speed: p5.Vector
  private dir: p5.Vector

  constructor(
    pos: p5.Vector,
    dir: p5.Vector,
    speed: p5.Vector,
    diameter: number
  ) {
    this.pos = pos
    this.originalDiameter = this.diameter = diameter
    this.speed = speed
    this.dir = dir
  }

  update(p: p5, min: p5.Vector, max: p5.Vector) {
    this.diameter =
      this.originalDiameter +
      this.originalDiameter * p.sin(p.frameCount * p.noise(this.pos.x)) * 0.7

    if (this.pos.x < min.x + this.diameter / 2) {
      this.dir.x = 1
    }
    if (this.pos.x > max.x - this.diameter / 2) {
      this.dir.x = -1
    }
    if (this.pos.y < min.y + this.diameter / 2) {
      this.dir.y = 1
    }
    if (this.pos.y > max.y - this.diameter / 2) {
      this.dir.y = -1
    }
    this.pos.add(
      this.speed.x * speedOffset * this.dir.x +
        p.cos(p.frameCount * 0.1) * this.speed.x * 0.2,
      this.speed.y * speedOffset * this.dir.y +
        p.sin(p.frameCount * 0.1) * this.speed.y * 0.2
    )
  }
}
