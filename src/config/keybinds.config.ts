import { getOS } from '@/lib/utils'

export const KEYMAPPER = {
  Control: (() => {
    if (getOS() === 'mac') return '⌘'
    return 'Ctrl'
  })(),
  Alt: (() => {
    if (getOS() === 'mac') return '⌥'
    return 'Alt'
  })(),
}

export const KEYBINDS = {
  RESTART: {
    label: 'Enter',
    hotkey: 'Enter',
  },
  NEW_GAME: {
    label: `${KEYMAPPER.Control} + Enter`,
    hotkey: 'Ctrl+Enter',
  },
  SETTINGS: {
    label: `${KEYMAPPER.Alt} + Enter`,
    hotkey: 'Alt+Enter',
  },
  TOGGLE_PLAY: {
    label: `${KEYMAPPER.Control} + Down`,
    hotkey: 'Ctrl+Down',
  },
  PREVIOUS_TRACK: {
    label: `${KEYMAPPER.Control} + Left`,
    hotkey: 'Ctrl+Left',
  },
  NEXT_TRACK: {
    label: `${KEYMAPPER.Control} + Right`,
    hotkey: 'Ctrl+Right',
  },
}
