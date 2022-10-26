export const util = {
  getHexColors: (paletteUrl) => {
    return paletteUrl
      .split('/')[3]
      .split('-')
      .map((c) => `#${c}`)
  },
  convertHexToRGB: (_color) => {
    _color = _color.replace('#', '')
    const aRgbHex = _color.match(/.{1,2}/g)
    return [
      parseInt(aRgbHex[0], 16) / 255.0,
      parseInt(aRgbHex[1], 16) / 255.0,
      parseInt(aRgbHex[2], 16) / 255.0,
    ]
  },
  shuffle: ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  },
  generateNumberArray: (size, offset = 0) => {
    return [...Array(size)].map((_, i) => offset + i)
  },
  sortAscending: (array) => {
    return array.sort((a, b) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
  },
}
