<template>
  <A class="button" :class="buttonStyle" @onClicked="onClicked">
    <slot></slot>
  </A>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import A from './A.vue'
import { ButtonStyle } from '~/types/dto'
@Component({
  components: { A },
})
export default class Button extends Vue {
  @Prop({ default: ButtonStyle.FILL_BLACK })
  private buttonStyle!: ButtonStyle

  private onClicked(e: Event) {
    this.$emit('onClicked', e)
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.button
  min-height 48px
  display inline-flex
  align-items center
  justify-content center
  color $primary_text_color
  background-color $white_fff
  border 2px $white_fff solid
  padding $padding_8 $padding_16
  box-sizing border-box
  font-size $font_size_16
  font-weight bold
  text-decoration none
  min-width 128px

  &.fillBlack
    color $white_fff
    background-color $black_212121
    border 2px $black_212121 solid

  &.fillSmoke
    color $primary_text_color
    background-color $gray_e9e9e9
    border 2px $gray_e9e9e9 solid

  &.fillWhite
    color $primary_text_color
    background-color $white_fff
    border 2px $white_fff solid

  &.fillYellow
    color $primary_text_color
    background-color $yellow_fbd100
    border 2px $yellow_fbd100 solid

  &.fillTwitter
    color $white_fff
    background-color $twitter_color
    border 2px $twitter_color solid

  &.fillFacebook
    color $white_fff
    background-color $facebook_color
    border 2px $facebook_color solid

  &.fillEmail
    color $white_fff
    background-color $email_color
    border 2px $email_color solid

  &.fillDisabled
    color $black_212121_opa40
    background-color $gray_f8f8f8
    border 2px $gray_f8f8f8 solid
    pointer-events none

  &.strokeBlack
    color $primary_text_color
    background-color transparent
    border 2px $black_212121 solid
</style>
