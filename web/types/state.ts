import { MidiControls } from '~/types/dto'

export interface ConfigModalState {
  isVisible: boolean
}

export interface MidiControllerState {
  currentNoteNumber: number
  currentControlNumber: number
  noteAndControls: Map<number, MidiControls>
}

export interface AssetState {
  currentImageIndex: number
}
