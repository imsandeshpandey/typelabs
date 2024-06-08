const appStandard = {
  1: 'Esc',

  59: 'F1',
  60: 'F2',
  61: 'F3',
  62: 'F4',
  63: 'F5',
  64: 'F6',
  65: 'F7',
  66: 'F8',
  67: 'F9',
  68: 'F10',
  87: 'F11',
  88: 'F12',

  91: 'F13',
  92: 'F14',
  93: 'F15',

  41: '`',

  2: '1',
  3: '2',
  4: '3',
  5: '4',
  6: '5',
  7: '6',
  8: '7',
  9: '8',
  10: '9',
  11: '0',

  12: '-',
  13: '=',
  14: 'Backspace',

  15: 'Tab',
  58: 'CapsLock',

  30: 'A',
  48: 'B',
  46: 'C',
  32: 'D',
  18: 'E',
  33: 'F',
  34: 'G',
  35: 'H',
  23: 'I',
  36: 'J',
  37: 'K',
  38: 'L',
  50: 'M',
  49: 'N',
  24: 'O',
  25: 'P',
  16: 'Q',
  19: 'R',
  31: 'S',
  20: 'T',
  22: 'U',
  47: 'V',
  17: 'W',
  45: 'X',
  21: 'Y',
  44: 'Z',

  26: '[',
  27: ']',
  43: '\\',

  39: ';',
  40: "'",
  28: 'Enter',

  51: ',',
  52: '.',
  53: '/',

  57: 'Space',

  3639: 'PrtSc',
  70: 'ScrLk',
  3653: 'Pause',

  3666: 'Ins',
  3667: 'Del',
  3655: 'Home',
  3663: 'End',
  3657: 'PgUp',
  3665: 'PgDn',

  57416: 'â†‘',
  57419: 'â†',
  57421: 'â†’',
  57424: 'â†“',

  42: 'Shift',
  54: 'Shift',
  29: 'Ctrl',
  3613: 'Ctrl',
  56: 'Alt',
  3640: 'Alt',
  3675: 'Meta',
  3676: 'Meta',
  3677: 'Menu',

  // Numpad
  69: 'Num Lock',
  3637: '/', // Numpad
  55: '*', // Numpad
  74: '-', // Numpad
  3597: '=', // Numpad
  78: '+', // Numpad
  3612: 'Enter', // Numpad
  83: '.', // Numpad

  79: '1', // Numpad
  80: '2', // Numpad
  81: '3', // Numpad
  75: '4', // Numpad
  76: '5', // Numpad
  77: '6', // Numpad
  71: '7', // Numpad
  72: '8', // Numpad
  73: '9', // Numpad
  82: '0', // Numpad
} as const

const windows = {
  '8': 'Backspace',
  '9': 'Tab',
  '13': 'Enter',
  '16': 'Shift',
  '17': 'Ctrl',
  '18': 'Alt',
  '20': 'CapsLock',
  '27': 'Esc',
  '32': 'Space',
  '33': 'PgUp',
  '34': 'PgDn',
  '35': 'End',
  '36': 'Home',
  '37': 'â†',
  '38': 'â†‘',
  '39': 'â†’',
  '40': 'â†“',
  '46': 'Del',
  '48': '0',
  '49': '1',
  '50': '2',
  '51': '3',
  '52': '4',
  '53': '5',
  '54': '6',
  '55': '7',
  '56': '8',
  '57': '9',
  '65': 'A',
  '66': 'B',
  '67': 'C',
  '68': 'D',
  '69': 'E',
  '70': 'F',
  '71': 'G',
  '72': 'H',
  '73': 'I',
  '74': 'J',
  '75': 'K',
  '76': 'L',
  '77': 'M',
  '78': 'N',
  '79': 'O',
  '80': 'P',
  '81': 'Q',
  '82': 'R',
  '83': 'S',
  '84': 'T',
  '85': 'U',
  '86': 'V',
  '87': 'W',
  '88': 'X',
  '89': 'Y',
  '90': 'Z',
  '91': 'Meta',
  '93': 'Meta',
  '96': 'Numpad 0',
  '97': 'Numpad 1',
  '98': 'Numpad 2',
  '99': 'Numpad 3',
  '100': 'Numpad 4',
  '101': 'Numpad 5',
  '102': 'Numpad 6',
  '103': 'Numpad 7',
  '104': 'Numpad 8',
  '105': 'Numpad 9',
  '106': 'Numpad *',
  '107': 'Numpad +',
  '109': 'Numpad -',
  '110': 'Numpad .',
  '111': 'Numpad /',
  '112': 'F1',
  '113': 'F2',
  '114': 'F3',
  '115': 'F4',
  '116': 'F5',
  '117': 'F6',
  '118': 'F7',
  '119': 'F8',
  '120': 'F9',
  '121': 'F10',
  '122': 'F11',
  '123': 'F12',
  '144': 'Num Lock',
  '186': ';',
  '187': '=',
  '188': ',',
  '189': '-',
  '190': '.',
  '191': '/',
  '192': '`',
  '219': '[',
  '220': '\\',
  '221': ']',
  '222': "'",
} as const

// maps browser codes to app codes
const appMap = {
  KeyD: '32',
  KeyS: '31',
  KeyA: '30',
  F1: '59',
  F2: '60',
  F3: '61',
  F4: '62',
  F5: '63',
  F6: '64',
  MetaLeft: '3675',
  F7: '65',
  F8: '66',
  F9: '67',
  F10: '68',
  F11: '87',
  F12: '88',
  F13: '91',
  F14: '92',
  F15: '93',
  Backquote: '41',
  Digit1: '2',
  Digit2: '3',
  Digit3: '4',
  Digit4: '5',
  Digit5: '6',
  Digit6: '7',
  Digit7: '8',
  Digit8: '9',
  Digit9: '10',
  Digit0: '11',
  Minus: '12',
  Equal: '13',
  Backspace: '14',
  Tab: '15',
  KeyQ: '16',
  KeyW: '17',
  KeyE: '18',
  KeyR: '19',
  KeyT: '20',
  KeyY: '21',
  KeyU: '22',
  KeyI: '23',
  KeyO: '24',
  KeyP: '25',
  BracketLeft: '26',
  BracketRight: '27',
  Backslash: '43',
  Enter: '28',
  Quote: '40',
  CapsLock: '58',
  Comma: '51',
  KeyL: '38',
  KeyK: '37',
  KeyM: '50',
  KeyF: '33',
  KeyJ: '36',
  KeyN: '49',
  KeyH: '35',
  KeyB: '48',
  KeyG: '34',
  KeyV: '47',
  KeyC: '46',
  ShiftLeft: '42',
  ShiftRight: '54',
  KeyX: '45',
  KeyZ: '44',
  Period: '52',
  Slash: '53',
  Semicolon: '39',
  ControlLeft: '29',
  AltLeft: '56',
  Space: '57',
  MetaRight: '3676',
  AltRight: '3640',
  ArrowLeft: '57419',
  ArrowUp: '57416',
  ArrowRight: '57421',
  ArrowDown: '57424',
  Home: '3655',
  End: '3663',
  PageDown: '3665',
  PageUp: '3657',
  NumpadEnter: '3612',
  Delete: '3667',
  Escape: '1',

  // windows - needs testing
  NumpadMultiply: '55',
  Pause: '3653',
  ScrollLock: '70',
  Numpad7: '71',
  Numpad8: '72',
  Numpad9: '73',
  NumpadSubtract: '74',
  Numpad4: '75',
  Numpad5: '76',
  Numpad6: '77',
  NumpadAdd: '78',
  Numpad1: '79',
  Numpad2: '80',
  Numpad3: '81',
  Numpad0: '82',
  NumpadDecimal: '83',
  PrintScreen: '3639',
  NumLock: '69',
  Insert: '3666',
  ContextMenu: '3677',
  RightControl: '3613',
  NumpadDivide: '3637', // experimental
  NumpadEqual: '3597', // experimental
} as const

export function getAppKey(
  keyCode: keyof typeof windows,
  key: keyof typeof appMap
) {
  if (appMap[key] !== undefined) {
    return appMap[key]
  }
  const keyName = windows[keyCode]
  for (const code in appStandard) {
    const key = appStandard[code as unknown as keyof typeof appStandard]
    if (key == keyName) {
      return code
    }
  }
  return null
}

export function getAppKeyName(keyCode: string) {
  for (const key in appMap) {
    if (appMap[key as unknown as keyof typeof appMap] == keyCode) {
      return key
    }
  }
  return undefined
}
