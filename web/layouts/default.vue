<template>
  <div>
    <Nuxt />
    <MidiController />
    <ObserveData />
    <ConfigModal v-if="showConfigModal" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ConfigModal from '~/components/ConfigModal.vue'
import MidiController from '~/components/MidiController.vue'
import ObserveData from '~/components/ObserveData.vue'

@Component({
  components: {
    ConfigModal,
    MidiController,
    ObserveData,
  },
})
export default class extends Vue {
  mounted() {
    document.addEventListener('keydown', this.keydownEventListener)
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownEventListener)
  }

  private keydownEventListener(event) {
    if (event.key === 'c') {
      this.updateConfigModalVisibility()
    }
  }

  private updateConfigModalVisibility() {
    this.$store.dispatch('modal/configModal/toggle')
  }

  private get showConfigModal(): boolean {
    return this.$store.state.modal.configModal.isVisible
  }
}
</script>

<style lang="stylus">
@require '~@/assets/style/common.styl'
</style>
