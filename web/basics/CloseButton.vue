<template>
  <div class="closeButton" :class="color" @click="onClicked">
    <i class="mdi mdi-close" :style="{ fontSize: size + 'px' }" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Color } from '~/types/dto'

@Component({
  components: {},
})
export default class CloseButton extends Vue {
  @Prop({ default: Color.BLACK }) color!: Color
  @Prop({ default: 24 }) size!: number

  private onClicked(e: Event) {
    this.$emit('onClicked', e)
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'

.closeButton
  width 40px
  height 40px
  display inline-flex
  align-items center
  justify-content center
  cursor pointer

  &.black
    color $black_212121

  &.white
    color $white_fff
</style>
