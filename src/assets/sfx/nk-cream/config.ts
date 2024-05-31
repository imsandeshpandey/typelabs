export type Config = {
  id: string
  name: string
  key_define_type: 'key' | 'code'
  includes_numpad: boolean
  sound: string
  sprites: Record<string, [number, number]>
}

import sound from './nk-cream.wav'

export const nkCream: Config = {
  id: 'sound-pack-1200000000011',
  name: 'NK Cream',
  key_define_type: 'key',
  includes_numpad: false,
  sound,
  sprites: {
    Backquote: [4146, 206], //q
    Digit1: [6956, 203], //z
    Digit2: [6501, 255], //x
    Digit3: [608, 216], //c
    Digit4: [6076, 193], //v
    Digit5: [185, 198], //b
    Digit6: [3502, 174], //n
    Digit7: [3353, 149], //m
    Digit8: [3124, 229], //l
    Digit9: [7159, 238], //BracketLeft
    Digit0: [7397, 232], //BracketRight
    Minus: [7159, 238], //BracketLeft
    Equal: [7397, 232], //BracketRight
    Backspace: [383, 225],

    Tab: [5502, 348],
    KeyQ: [4146, 206],
    KeyW: [6269, 232],
    KeyE: [1398, 201],
    KeyR: [4352, 244],
    KeyT: [5258, 244],
    KeyY: [6756, 200],
    KeyU: [5850, 226],
    KeyI: [2454, 223],
    KeyO: [3676, 238],
    KeyP: [3914, 232],
    BracketLeft: [7159, 238],
    BracketRight: [7397, 232],
    Backslash: [5502, 348], // Tab

    Capslock: [824, 348],
    KeyA: [0, 185],
    KeyS: [4596, 219],
    KeyD: [1172, 226],
    KeyF: [1833, 222],
    KeyG: [2055, 209],
    KeyH: [2264, 190],
    KeyJ: [2677, 232],
    KeyK: [2909, 215],
    KeyL: [3124, 229],
    Comma: [2909, 215], //k
    Quote: [3124, 229], //l
    Enter: [1599, 234],

    ShiftLeft: [4815, 234],
    KeyZ: [6956, 203],
    KeyX: [6501, 255],
    KeyC: [608, 216],
    KeyV: [6076, 193],
    KeyB: [185, 198],
    KeyN: [3502, 174],
    KeyM: [3353, 149],
    ShiftRight: [4815, 234], //Shift Left

    ControlLeft: [5502, 348], // Tab
    AltLeft: [5502, 348], // Tab
    Space: [5049, 209],
    AltRight: [5502, 348], // Tab
    ControlRight: [5502, 348], // Tab

    ArrowUp: [2264, 190], // H
    ArrowLeft: [185, 198], // B
    ArrowDown: [3502, 174], // N
    ArrowRight: [3353, 149], // M
    undefined: [13964, 113],
  },
}
