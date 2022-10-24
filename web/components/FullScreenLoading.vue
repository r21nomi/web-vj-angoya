<template>
  <div class="fullScreenLoading">
    <LoadingItem class="loadingItem" :size="size" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import LoadingItem from '~/components/LoadingItem.vue'

@Component({
  components: { LoadingItem },
})
export default class FullScreenLoading extends Vue {
  @Prop({ default: 48 }) private size!: number
}
</script>

<style scoped lang="stylus">
@require '~@/assets/style/variables.styl'
@require '~@/assets/style/mixin.styl'

.fullScreenLoading
  width 100%
  height 100%
  position fixed
  top 0
  left 0
  background-color $black_212121_opa60
  z-index $z_index_loading

  .loadingItem
    position fixed
    centerAbsContent()
</style>
