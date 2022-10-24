export interface MidiControls {
  controls: Map<number, number>
}

export enum ButtonStyle {
  FILL_DISABLED = 'fillDisabled',
  FILL_WHITE = 'fillWhite',
  FILL_BLACK = 'fillBlack',
}

export enum Color {
  BLACK = 'black',
  WHITE = 'white',
  YELLOW = 'yellow',
}
