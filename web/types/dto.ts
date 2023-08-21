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

export enum ArtType {
  THREE_D_TILE = 1,
  CAVE = 2,
}
