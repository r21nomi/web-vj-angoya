<template>
  <div class="modal" :class="{ sp: $device.isMobileOrTablet }">
    <div class="background" @click="onCloseAreaClicked"></div>
    <div class="modalContainer">
      <div class="contentsContainer" :class="modalBackgroundColor">
        <slot></slot>
        <CloseButton v-if="!hideCloseButton" @onClicked="onCloseAreaClicked" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import A from '~/basics/A.vue'
import CloseButton from '~/basics/CloseButton.vue'
import { Color } from '~/types/dto'

@Component({
  components: { CloseButton, A },
})
export default class Modal extends Vue {
  @Prop({ default: Color.WHITE }) private modalBackgroundColor!: Color
  @Prop({ default: false }) private hideCloseButton!: boolean

  private onCloseAreaClicked() {
    this.$emit('onCloseAreaClicked')
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.modal
  width 100%
  height 100%
  position fixed
  top 0
  left 0
  z-index $z-index_modal

  .background
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    background-color $black_212121_opa60

  .modalContainer
    width 100%
    height 100%
    max-width 1024px
    position absolute
    top 50%
    left 50%
    transform translateX(-50%) translateY(-50%)
    padding 20px
    box-sizing border-box

    .contentsContainer
      height 100%
      min-height 400px
      position relative
      padding 60px
      box-sizing border-box
      margin 0 auto

      .closeButton
        position absolute
        top 10px
        right 10px
        z-index $z_index_modal

      &.white
        background-color $white_fff

  &.sp
    .contentsContainer
      padding 60px 16px 16px
</style>
