<template>
  <div
    v-if="isBackgroundImage"
    class="imageView"
    :style="{ backgroundImage: `url(${url})` }"
  >
    <slot></slot>
  </div>
  <img v-else class="imageView" :src="url" :alt="alt" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class ImageView extends Vue {
  @Prop({ default: '' }) private url!: string
  @Prop({ default: '' }) private alt!: string
  @Prop({ default: false }) private isBackgroundImage!: boolean
}
</script>
