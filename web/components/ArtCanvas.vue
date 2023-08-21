<template>
  <div>
    <div v-if="isP5" id="canvasContainer" class="artCanvas"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
// import { Art } from '~/art/art'
import { ArtType, MidiControls } from '~/types/dto'
import { Art3D } from '~/art/art3d'
import { ArtP5 } from '~/art/artP5js'

@Component({
  components: {},
})
export default class ArtCanvas extends Vue {
  private art: any = null
  private analyser: any = null
  private isP5: boolean = false

  @Watch('$store.state.midiController.currentNoteNumber')
  private onCurrentNoteNumberChanged(num: number) {
    if (num >= 0 && num <= 1) {
      // Change art
      const canvas = document.querySelector('canvas')
      if (canvas) {
        this.art.dispose()
        canvas.remove()

        if (num === 0) {
          this.art = new Art3D(ArtType.THREE_D_TILE)
        } else if (num === 1) {
          this.art = new Art3D(ArtType.CAVE)
        }
        this.art.setAnalyser(this.analyser)
      }
    } else if (this.art) {
      this.updateNoteNumber()
    }
  }

  @Watch('$store.state.midiController.noteAndControls')
  private onNoteAndControlsChanged() {
    this.updateNoteNumber()
  }

  @Watch('$store.state.asset.currentImageIndex')
  private onCurrentImageIndexChanged(index: number) {
    if (this.art) {
      // indexは/imgの中の画像のファイル名を指すことを想定（ex. 1.jpg）
      console.log(`do update!!!!!!!!!!: ${index}`)
      if (this.isP5) {
        this.art.create(`img/${index}.jpg`)
      } else {
        this.art.updateTexture(`img/${index}.jpg`)
      }
    }
  }

  mounted() {
    // this.art = new Art()
    if (this.isP5) {
      this.art = new ArtP5('canvasContainer')
      this.art.create()
    } else {
      this.art = new Art3D()
      // this.art = new Art2D()
    }
    // this.initAudioInterface()

    document.addEventListener('keyup', this.keyListener)
  }

  beforeDestroyed() {
    document.removeEventListener('keyup', this.keyListener)
  }

  private keyListener(event) {
    const keyName = event.key
    if (keyName === ' ') {
      this.initAudioInterface()
    }
  }

  private updateNoteNumber() {
    if (this.art) {
      this.art.updateNoteNumber(
        this.currentNote,
        this.currentControlNumber,
        this.controls
      )
    }
  }

  private async initAudioInterface() {
    const audioCtx = new AudioContext()
    this.analyser = audioCtx.createAnalyser()
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
    source.connect(this.analyser)
    if (this.art) {
      this.art.setAnalyser(this.analyser)
    }
  }

  private get currentNote(): number {
    return this.$store.state.midiController.currentNoteNumber
  }

  private get currentControlNumber(): number {
    return this.$store.state.midiController.currentControlNumber
  }

  private get controls(): MidiControls {
    return this.$store.getters['midiController/currentMidiControls']()
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.artCanvas
  width 100%
  height 100%
  position fixed
  overflow hidden
</style>
