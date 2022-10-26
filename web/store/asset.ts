import { AssetState } from '~/types/state'

export const state = (): AssetState => ({
  currentImageIndex: 1,
})

export const mutations = {
  setCurrentImageIndex(state: AssetState, index: number) {
    state.currentImageIndex = index
  },
}

export const actions = {
  setCurrentImageIndex({ commit }, index: number) {
    commit('setCurrentImageIndex', index)
  },
}
