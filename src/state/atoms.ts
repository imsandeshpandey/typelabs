import { DEFAULT_THEME } from '@/config/themes'
import { FONTS } from '@/config/fonts'
import {
  CURRENT_FONT_KEY,
  CURRENT_THEME_KEY,
  KB_VOLUME_KEY,
  KEYBOARD_SOUND_ATOM,
  MUSIC_VOLUME_KEY,
  UI_VOLUME_KEY,
  USER_FONTS_KEY,
} from '@/config/local-storage-keys'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Config, nkCream } from '@/assets/sfx/nk-cream/config'

const fontAtom = atomWithStorage(CURRENT_FONT_KEY, FONTS[2])
const themeAtom = atomWithStorage(CURRENT_THEME_KEY, DEFAULT_THEME)
const userFontsAtom = atomWithStorage<string[]>(USER_FONTS_KEY, [])
export const uiVolumeAtom = atomWithStorage<number>(UI_VOLUME_KEY, 1)
export const keyboardVolumeAtom = atomWithStorage<number>(KB_VOLUME_KEY, 1)
export const musicVolumeAtom = atomWithStorage<number>(MUSIC_VOLUME_KEY, 1)

export const keyboardSoundAtom = atomWithStorage<Config>(
  KEYBOARD_SOUND_ATOM,
  nkCream
)

// Atom with STORAGE
export const useFont = () => useAtom(fontAtom)
export const useColorStyle = () => useAtom(themeAtom)
export const useUserFonts = () => useAtom(userFontsAtom)
export const useUiVolume = () => useAtom(uiVolumeAtom)
export const useKeyboardVolume = () => useAtom(keyboardVolumeAtom)
export const useMusicVolume = () => useAtom(musicVolumeAtom)
export const useKeyboardSound = () => useAtom(keyboardSoundAtom)
