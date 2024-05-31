import { Config } from '../nk-cream/config'
import sound from './oreo.ogg'

export const egOreo: Config = {
  id: 'sound-pack-1200000000010',
  name: 'EG Oreo',
  key_define_type: 'code',
  includes_numpad: true,
  sound,
  sprites: {
    Escape: [971, 142], //esc
    F1: [1272, 126],
    F2: [1603, 125],
    F3: [1924, 128],
    F4: [2240, 126],
    F5: [2566, 126],
    F6: [2869, 122],
    F7: [3179, 131],
    F8: [3480, 115],
    F9: [3782, 124],
    F10: [4076, 126],
    F11: [4377, 120],
    F12: [4988, 135],

    Backquote: [972, 131],
    Digit1: [1276, 115], //1
    Digit2: [1604, 122], //2
    Digit3: [1929, 122], //3
    Digit4: [2237, 134], //4
    Digit5: [2571, 120], //5
    Digit6: [2869, 122], //6
    Digit7: [3177, 130], //7
    Digit8: [3482, 110], //8
    Digit9: [3782, 121], //9
    Digit0: [4077, 128], //0
    Minus: [4376, 120], //-
    Equal: [4673, 123], //=
    Backspace: [4991, 131], //backspace

    Tab: [5968, 123], //
    KeyQ: [6221, 114],
    KeyW: [6515, 120],
    KeyE: [6823, 113],
    KeyR: [7112, 110],
    KeyT: [7412, 107],
    KeyY: [7716, 112],
    KeyU: [8012, 118],
    KeyI: [8326, 112],
    KeyO: [8623, 111],
    KeyP: [8932, 112],
    BracketLeft: [9246, 117],
    BracketRight: [9586, 118],
    Backslash: [9915, 121],

    CapsLock: [10885, 126],
    KeyA: [11171, 109],
    KeyS: [11462, 120],
    KeyD: [11784, 106],
    KeyF: [12080, 104],
    KeyG: [12400, 117],
    KeyH: [12715, 110],
    KeyJ: [13014, 109],
    KeyK: [13333, 116],
    KeyL: [13638, 113],
    Semicolon: [13967, 106],
    Quote: [14280, 101],
    Enter: [14603, 116],

    ShiftLeft: [15759, 123],
    KeyZ: [16203, 127],
    KeyX: [16533, 117],
    KeyC: [16843, 111],
    KeyV: [17166, 103],
    KeyB: [17455, 109],
    KeyN: [17767, 108],
    KeyM: [18088, 104],
    Comma: [18402, 104],
    Period: [18720, 110],
    Slash: [19044, 108],
    ShiftRight: [19375, 124],

    ControlLeft: [20804, 118],
    MetaLeft: [21097, 129],
    AltLeft: [21399, 119],
    Space: [24626, 143],
    AltRight: [22658, 126],
    MetaRight: [22917, 129],
    RightControl: [23519, 127],

    NumpadMultiply: [6822, 116],
    NumLock: [6216, 122],
    ScrollLock: [12080, 103],
    Numpad7: [8322, 117],
    Numpad8: [8620, 113],
    Numpad9: [8931, 114],
    NumpadSubtract: [7114, 109],
    Numpad4: [9242, 122],
    Numpad5: [9580, 131],
    Numpad6: [9913, 118],
    NumpadAdd: [7409, 117],
    Numpad1: [10228, 118],
    Numpad2: [11173, 110],
    Numpad3: [11463, 118],
    Numpad0: [8012, 115],
    NumpadDecimal: [12079, 112],

    NumpadEnter: [7715, 112],
    NumpadDivide: [6511, 126],
    PrintScreen: [11782, 110],
    Pause: [12715, 106],
    Home: [13328, 126],
    PageUp: [13641, 107],
    End: [14278, 104],
    PageDown: [14602, 120],
    Insert: [13016, 108],
    Delete: [13964, 113],
    ContextMenu: [23232, 126],
    ArrowUp: [19720, 122],
    ArrowLeft: [23797, 119],
    ArrowRight: [22657, 129],
    ArrowDown: [24087, 119],
    undefined: [13964, 113],
  },
}
