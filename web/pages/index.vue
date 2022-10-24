<template>
  <div class="topPage" :class="{ sp: $device.isMobile }">
    <ArtCanvas />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArtCanvas from '~/components/ArtCanvas.vue'

@Component({
  components: { ArtCanvas },
})
export default class TopPage extends Vue {}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'
</style>
