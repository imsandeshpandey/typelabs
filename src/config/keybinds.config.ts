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
    label: `${KEYMAPPER.Control} + Space`,
    hotkey: 'Ctrl+Space',
  },
}
