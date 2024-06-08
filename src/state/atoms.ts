import { DEFAULT_THEME, themes } from '@/config/themes.config'
import { FONTS } from '@/config/fonts.config'
import {
  BROWSER_ZOOM,
  CURRENT_FONT_KEY,
  CURRENT_COLOR_STYLE_KEY,
  KB_VOLUME_KEY,
  KEYBOARD_SOUND_ATOM,
  TRACK_INFO_KEY,
  UI_VOLUME_KEY,
  USER_FONTS_KEY,
  CURRENT_THEME_KEY,
  NOTIFICATIONS_VOLUME_KEY,
} from '@/config/local-storage-keys.config'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { nkCream } from '@/assets/sfx/keyboard-soundpacks/nk-cream/config'
import { KeyboardSoundPackConfig } from '@/assets/sfx/keyboard-soundpacks/keyboard-soundpacks.type'

const fontAtom = atomWithStorage(CURRENT_FONT_KEY, FONTS[2])
const colorStyleAtom = atomWithStorage(CURRENT_COLOR_STYLE_KEY, DEFAULT_THEME)
const userFontsAtom = atomWithStorage<string[]>(USER_FONTS_KEY, [])
const browserZoomAtom = atomWithStorage<number>(BROWSER_ZOOM, 100)

export const uiVolumeAtom = atomWithStorage<number>(UI_VOLUME_KEY, 1)
export const keyboardVolumeAtom = atomWithStorage<number>(KB_VOLUME_KEY, 1)
export const notificationsVolumeAtom = atomWithStorage<number>(
  NOTIFICATIONS_VOLUME_KEY,
  1
)
export const keyboardSoundAtom = atomWithStorage<KeyboardSoundPackConfig>(
  KEYBOARD_SOUND_ATOM,
  nkCream
)
export const currentTrackInfoAtom = atomWithStorage<{
  playlistId: string
  currentTrackIndex: number
}>(TRACK_INFO_KEY, { playlistId: '', currentTrackIndex: 0 })

export const currentThemeConfig = atom(themes[0])
export const trueThemeAtom = atom<'light' | 'dark'>('light')
export const trackListAtom = atom<SpotifyApi.PlaylistTrackObject[]>([])
export const trackUriListAtom = atom<string[]>((get) =>
  get(trackListAtom).map((track) => track.track.uri)
)

export const themeAtom = atomWithStorage<'light' | 'dark' | 'system'>(
  CURRENT_THEME_KEY,
  'dark'
)
export const useTheme = () => useAtom(themeAtom)
export const useTrueTheme = () => useAtom(trueThemeAtom)
export const useTrackList = () => useAtom(trackListAtom)
export const useTrackUriList = () => useAtom(trackUriListAtom)
export const useCurrentThemeConfig = () => useAtom(currentThemeConfig)
export const useCurrentTrackInfo = () => useAtom(currentTrackInfoAtom)
export const useBrowserZoom = () => useAtom(browserZoomAtom)
export const useFont = () => useAtom(fontAtom)
export const useColorStyle = () => useAtom(colorStyleAtom)
export const useUserFonts = () => useAtom(userFontsAtom)
export const useUiVolume = () => useAtom(uiVolumeAtom)
export const useKeyboardVolume = () => useAtom(keyboardVolumeAtom)
export const useNotificationsVolume = () => useAtom(notificationsVolumeAtom)
export const useKeyboardSound = () => useAtom(keyboardSoundAtom)
