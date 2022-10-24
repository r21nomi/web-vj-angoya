<template>
  <a
    href="javascript:void(0)"
    @click="onClicked"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class A extends Vue {
  private onClicked(e: Event) {
    this.$emit('onClicked', e)
  }

  private onMouseEnter() {
    this.$emit('onMouseEnter')
  }

  private onMouseLeave() {
    this.$emit('onMouseLeave')
  }
}
</script>
