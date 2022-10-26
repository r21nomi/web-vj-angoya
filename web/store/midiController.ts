import { MidiControllerState } from '~/types/state'
import { MidiControls } from '~/types/dto'

export const NOTE_NUM = parseInt(process.env.NOTE_NUM as string)
export const FIRST_NOTE_NUMBER = parseInt(
  process.env.FIRST_NOTE_NUMBER as string
)
const CONTROL_NUM = parseInt(process.env.CONTROL_NUM as string)
const FIRST_CONTROL_NUMBER = parseInt(
  process.env.FIRST_CONTROL_NUMBER as string
)

export const state = (): MidiControllerState => ({
  currentNoteNumber: 0,
  currentControlNumber: 0,
  noteAndControls: new Map(
    [...Array(NOTE_NUM)].map((_, index) => [index, getEmptyControls()])
  ),
})

export const mutations = {
  setCurrentNoteNumber(state: MidiControllerState, num: number) {
    state.currentNoteNumber = num
  },
  setCurrentControlNumber(state: MidiControllerState, num: number) {
    state.currentControlNumber = num
  },
  setControl(
    state: MidiControllerState,
    arg: { controlNumber: number; controlValue: number }
  ) {
    const c = state.noteAndControls.get(state.currentNoteNumber)
    c?.controls.set(arg.controlNumber, arg.controlValue)
    if (c) {
      state.noteAndControls.set(state.currentNoteNumber, c)
      state.noteAndControls = new Map(state.noteAndControls)
    }
  },
}

export const actions = {
  setCurrentNoteNumber({ commit }, num: number) {
    const _number = num - FIRST_NOTE_NUMBER
    console.log(`num: ${_number}`)
    commit('setCurrentNoteNumber', _number)
  },
  setControl({ commit }, arg: { controlNumber: number; controlValue: number }) {
    const controlNumber = arg.controlNumber - FIRST_CONTROL_NUMBER
    console.log(`num: ${controlNumber}, val: ${arg.controlValue}`)
    commit('setCurrentControlNumber', controlNumber)
    commit('setControl', {
      controlNumber,
      controlValue: arg.controlValue,
    })
  },
}

export const getters = {
  currentMidiControls: (state: MidiControllerState) => (): MidiControls => {
    return (
      state.noteAndControls.get(state.currentNoteNumber) || getEmptyControls()
    )
  },
  midiControls:
    (state: MidiControllerState) =>
    (index: number): MidiControls => {
      return (
        state.noteAndControls.get(index + FIRST_CONTROL_NUMBER) ||
        getEmptyControls()
      )
    },
}

const getEmptyControls = (): MidiControls => {
  return {
    controls: new Map([...Array(CONTROL_NUM)].map((_, index) => [index, 0])),
  }
}
