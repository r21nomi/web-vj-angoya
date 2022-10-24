import { MidiControls } from '~/types/dto'

export interface ConfigModalState {
  isVisible: boolean
}

export interface MidiControllerState {
  currentNoteNumber: number
  noteAndControls: Map<number, MidiControls>
}
