/**
 * https://docs.artblocks.io/creator-docs/creator-onboarding/readme/
 */
import { util } from '~/art/p5/util'

class Random {
  private hash: string
  private useA: boolean
  private prngA: any
  private prngB: any

  constructor(hash) {
    this.hash = hash
    this.useA = false
    const Sfc32: any = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16)
      let b = parseInt(uint128Hex.substr(8, 8), 16)
      let c = parseInt(uint128Hex.substr(16, 8), 16)
      let d = parseInt(uint128Hex.substr(24, 8), 16)
      return function () {
        a |= 0
        b |= 0
        c |= 0
        d |= 0
        const t = (((a + b) | 0) + d) | 0
        d = (d + 1) | 0
        a = b ^ (b >>> 9)
        b = (c + (c << 3)) | 0
        c = (c << 21) | (c >>> 11)
        c = (c + t) | 0
        return (t >>> 0) / 4294967296
      }
    }
    // seed prngA with first half of tokenData.hash
    this.prngA = new Sfc32(this.hash.substr(2, 32))
    // seed prngB with second half of tokenData.hash
    this.prngB = new Sfc32(this.hash.substr(34, 32))
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA()
      this.prngB()
    }
  }

  // random number between 0 (inclusive) and 1 (exclusive)
  randomDec() {
    this.useA = !this.useA
    return this.useA ? this.prngA() : this.prngB()
  }

  // random number between a (inclusive) and b (exclusive)
  randomNum(a, b) {
    return a + (b - a) * this.randomDec()
  }

  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  randomInt(a, b) {
    return Math.floor(this.randomNum(a, b + 1))
  }

  // random boolean with p as percent liklihood of true
  randomBool(p) {
    return this.randomDec() < p
  }

  // random value in an array of items
  randomChoice(list) {
    return list[this.randomInt(0, list.length - 1)]
  }
}

const palettes = {
  molokai: util.getHexColors(
    'https://coolors.co/455354-f8f8f2-1b1d1e-f92672-a6e22e-ae81ff'
  ),
}

export class Feature {
  public TYPE: any = {
    scan: 'Scan',
    ball: 'Ball',
    cyclone: 'Cyclone',
  }

  private random: any
  private attributes: any

  constructor(hash) {
    this.random = new Random(hash)
    const type = [this.TYPE.scan, this.TYPE.ball, this.TYPE.cyclone]

    this.attributes = {
      type: this.random.randomChoice(type),
      palette: this.random.randomChoice(Object.keys(palettes)),
      tileRatioOffset: this.random.randomNum(0.2, 0.5),
      dynamic: this.random.randomBool(0.5),
      division: this.random.randomInt(4, 8),
      divider: this.random.randomBool(0.1) ? 2.0 : 0.0,
      code: this.random.randomBool(0.5),
      eraser: true,
    }
  }

  getBackgroundColor(randomize = false) {
    const palette = palettes[this.attributes.palette]
    if (randomize) {
      return util.shuffle(palette)[0]
    } else {
      return this.random.randomChoice(palette)
    }
  }
}
