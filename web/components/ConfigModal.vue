<template>
  <Modal
    class="configModal"
    :class="{ sp: isSP }"
    @onCloseAreaClicked="onCloseAreaClicked"
  >
    <h1 class="title">Config</h1>
    <p class="description">Please configure.</p>
    <div class="container"></div>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Modal from '~/basics/Modal.vue'

@Component({
  components: {
    Modal,
  },
})
export default class ConfigModal extends Vue {
  private onCloseAreaClicked() {
    this.closeModal()
  }

  private closeModal() {
    this.$store.dispatch('modal/configModal/close')
  }

  private get isSP(): boolean {
    return (this as any).$device.isMobile
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.configModal
  text-align center

  & >>> .modalContainer
    height auto

  .description
    margin-top $margin_16
</style>
