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

  mounted() {
    // this.art = new Art()
    this.art = new Art3D()
  }

  private updateNoteNumber() {
    if (this.art) {
      this.art.updateNoteNumber(this.currentNote, this.controls)
    }
  }

  private get currentNote(): number {
    return this.$store.state.midiController.currentNoteNumber
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
