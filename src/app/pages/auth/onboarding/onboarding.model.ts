export enum moveDirection {
  Forward = 'forward',
  Backwards = 'backwards'
}

export interface changeStage {
  direction: moveDirection,
  data?: any
}