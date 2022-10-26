<template>
  <canvas id="canvas" class="artCanvas"></canvas>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
// import { Art } from '~/art/art'
import { MidiControls } from '~/types/dto'
import { Art3D } from '~/art/art3d'

@Component({
  components: {},
})
export default class ArtCanvas extends Vue {
  private art: any = null
  private analyser: any = null

  @Watch('$store.state.midiController.currentNoteNumber')
  private onCurrentNoteNumberChanged() {
    if (this.art) {
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
      this.art.updateTexture(`img/${index}.jpg`)
    }
  }

  mounted() {
    // this.art = new Art()
    this.art = new Art3D()
    this.initAudioInterface()
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
