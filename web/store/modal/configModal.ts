import { ConfigModalState } from '~/types/state'

export const state = (): ConfigModalState => ({
  isVisible: false,
})

export const mutations = {
  setIsVisible(state: ConfigModalState, isVisible: boolean) {
    state.isVisible = isVisible
  },
}

export const actions = {
  toggle({ state, commit }) {
    commit('setIsVisible', !state.isVisible)
  },
  open({ commit }) {
    commit('setIsVisible', true)
  },
  close({ commit }) {
    commit('setIsVisible', false)
  },
}
