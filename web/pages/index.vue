<template>
  <div class="topPage" :class="{ sp: $device.isMobile }">
    <div is="style" v-if="shouldHideCursor">* { cursor: none !important; }</div>
    <ArtCanvas />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArtCanvas from '~/components/ArtCanvas.vue'

@Component({
  components: { ArtCanvas },
})
export default class TopPage extends Vue {
  private shouldHideCursor: boolean = true
  private cursorTimer: any | null = null

  mounted() {
    window.addEventListener('mousemove', this.onMousemove)
  }

  beforeDestroy() {
    if (this.cursorTimer) {
      clearTimeout(this.cursorTimer)
    }
  }

  private onMousemove() {
    this.shouldHideCursor = false

    if (this.cursorTimer) {
      clearTimeout(this.cursorTimer)
    }
    this.cursorTimer = setTimeout(() => {
      this.shouldHideCursor = true
    }, 1000)
  }
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'
</style>
