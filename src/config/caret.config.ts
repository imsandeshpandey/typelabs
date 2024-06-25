export const caretStyles = {
  LINE: 'line',
  UNDERLINE: 'underline',
  BLOCK: 'block',
  BOX: 'box',
} as const
export type CaretStyle = (typeof caretStyles)[keyof typeof caretStyles]
export const DEFAULT_CARET_STYLE = caretStyles.LINE

export const caretSmoothnessVariants = {
  OFF: 'off',
  FAST: 'fast',
  MEDIUM: 'medium',
  SLOW: 'slow',
} as const

export const caretSmoothnessValues = {
  [caretSmoothnessVariants.OFF]: 0,
  [caretSmoothnessVariants.FAST]: 0.1,
  [caretSmoothnessVariants.MEDIUM]: 0.2,
  [caretSmoothnessVariants.SLOW]: 0.3,
} as const
export type CaretSmoothness =
  (typeof caretSmoothnessVariants)[keyof typeof caretSmoothnessVariants]
export const DEFAULT_CARET_SMOOTHNESS = caretSmoothnessVariants.FAST
