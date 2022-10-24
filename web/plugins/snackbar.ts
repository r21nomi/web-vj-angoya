import { Plugin } from '@nuxt/types'

// Define so an error cannot be thrown in Vue components
declare module 'vue/types/vue' {
  // this.$snackbar inside Vue components
  interface Vue {
    $snackbar: any
  }
}

const snackbarPlugin: Plugin = ({ $toast }, inject) => {
  const snackbar = {
    success: (message: string) => {
      const option = message
        ? {
            message,
          }
        : {}
      $toast.global.success(option)
    },
    error: (message: string) => {
      const option = message
        ? {
            message,
          }
        : {}
      $toast.global.error(option)
    },
  }
  inject('snackbar', snackbar)
}

export default snackbarPlugin
