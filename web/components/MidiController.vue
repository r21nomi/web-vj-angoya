<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { WebMidi } from 'webmidi'
import { FIRST_NOTE_NUMBER, NOTE_NUM } from '~/store/midiController'

@Component({
  components: {},
})
export default class MidiController extends Vue {
  mounted() {
    this.initMidi()
  }

  private initMidi() {
    const onEnabled = () => {
      // Inputs
      WebMidi.inputs.forEach((input) => console.log(input.name))

      // Outputs
      // WebMidi.outputs.forEach((output) =>
      //   console.log(output.manufacturer, output.name)
      // )

      const myInput = WebMidi.getInputByName(
        process.env.MIDI_CONTROLLER_NAME as string
      )
      myInput.addListener('noteon', (e) => {
        // 0 ~ 63
        // 64 ~ 71
        this.$store.dispatch(
          'midiController/setCurrentNoteNumber',
          e.note.number
        )
      })
      myInput.addListener('controlchange', (e) => {
        const number = e.controller.number
        if (
          number >= FIRST_NOTE_NUMBER &&
          number <= FIRST_NOTE_NUMBER + NOTE_NUM
        ) {
          if (e.value === 1) {
            this.$store.dispatch('midiController/setCurrentNoteNumber', number)
          }
        } else if (number >= 43 && number <= 45) {
          if (e.value === 1) {
            this.$store.dispatch('midiController/setCurrentNoteNumber', number)
          }
        } else {
          this.$store.dispatch('midiController/setControl', {
            controlNumber: number,
            controlValue: e.value,
          })
        }
      })
    }

    WebMidi.enable()
      .then(onEnabled)
      .catch((err) => alert(err))
  }
}
</script>
