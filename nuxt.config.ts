import { ENV_PRD } from './configs/env.production'

export default {
  // ssr: true,
  mode: 'universal',
  srcDir: 'web/',
  head: {
    title: 'web-vj-angoya',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@/assets/style/common.styl', '@mdi/font/css/materialdesignicons.css'],
  plugins: [
    {
      src: '~plugins/snackbar',
      ssr: false,
    },
  ],
  components: true,
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/device',
    '@nuxtjs/toast',
    '@nuxtjs/firebase',
  ],
  axios: {},
  firebase: {
    config: {
      apiKey: ENV_PRD.API_KEY,
      authDomain: ENV_PRD.AUTH_DOMAIN,
      projectId: ENV_PRD.PROJECT_ID,
      storageBucket: ENV_PRD.STORAGE_BUCKET,
      messagingSenderId: ENV_PRD.MESSAGING_SENDER_ID,
      appId: ENV_PRD.APP_ID,
      measurementId: ENV_PRD.MEASUREMENT_ID,
    },
    services: {
      firestore: {
        enablePersistence: false,
      },
      analytics: {
        collectionEnabled: true,
      },
    },
  },
  toast: {
    position: 'bottom-right',
    register: [
      {
        name: 'success',
        message: (payload) => {
          return payload.message || '成功しました'
        },
        options: {
          type: 'success',
          duration: 5000,
        },
      },
      {
        name: 'error',
        message: (payload) => {
          return payload.message || 'エラーが発生しました'
        },
        options: {
          type: 'error',
          duration: 5000,
          keepOnHover: true,
        },
      },
    ],
  },
  build: {
    // Reference: https://github.com/mnmxmx/threejs-nuxt-sample/blob/master/nuxt.config.js
    transpile: ['three'],
    extend(config) {
      config.node = {
        fs: 'empty',
      }
      if (config.module) {
        config.module.rules.push({
          test: /\.(vert|frag)$/i,
          use: ['raw-loader'],
        })
      }
    },
  },
  env: ENV_PRD,
}
