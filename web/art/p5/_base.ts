import p5 from 'p5'

export interface P5Art {
  preload(img)
  setup()
  draw()
  setAnalyser(_analyser: any)
}

export class Base {
  protected p: p5
  protected feature: any
  protected analyser
  private imgGraphics
  private img

  constructor(p: p5, feature: any) {
    this.p = p
    this.feature = feature
  }

  setAnalyser(_analyser: any) {
    this.analyser = _analyser
  }

  preload(imgPath) {
    const _img = this.p.loadImage(imgPath)
    this.img = _img
  }

  createImageGraphic() {
    const p = this.p

    if (!this.imgGraphics) {
      this.imgGraphics = p.createGraphics(p.width, p.height)
      this.imgGraphics.background(`#fff`)

      const m = this.getDrawingArea(p)
      const winWidth = m.x
      const winHeight = m.y
      const imgWidth = this.img.width
      const imgHeight = this.img.height
      const isWinLandscape = winWidth > winHeight
      const isImgLandscape = imgWidth > imgHeight
      let imgW = 0
      let imgH = 0
      const alignVertical = () => {
        imgH = winHeight
        imgW = imgH * (imgWidth / imgHeight)
      }
      const alignHorizontal = () => {
        imgW = winWidth
        imgH = imgW * (imgHeight / imgWidth)
      }
      if (isWinLandscape) {
        if (isImgLandscape) {
          alignHorizontal()
          if (imgH > winHeight) {
            alignVertical()
          }
        } else {
          alignVertical()
        }
      } else if (isImgLandscape) {
        alignHorizontal()
      } else {
        alignVertical()
        if (imgW > winWidth) {
          alignHorizontal()
        }
      }

      this.imgGraphics.image(
        this.img,
        p.width / 2 - imgW / 2,
        p.height / 2 - imgH / 2,
        imgW,
        imgH
      )
      this.imgGraphics.loadPixels()
      // For debug
      // p.image(this.imgGraphics, 0, 0)
    }
  }

  getColor(x, y) {
    if (!this.imgGraphics) {
      return this.p.color(`#000`)
    }
    return this.imgGraphics.get(x, y)
  }

  getDrawingArea(graphic: p5): p5.Vector {
    const s = this.p.min(graphic.width, graphic.height) / 1.2
    return this.p.createVector(s, s)
  }

  getPadding(graphic: p5.Graphics): p5.Vector {
    const canvasSize = this.getDrawingArea(graphic)
    return this.p.createVector(
      (this.p.width - canvasSize.x) / 2,
      (this.p.height - canvasSize.y) / 2
    )
  }
}
