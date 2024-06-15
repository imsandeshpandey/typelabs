import { themes } from '@/config/themes.config'
import { FONTS } from '@/config/fonts.config'
import * as LK from '@/config/local-storage-keys.config'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { nkCream } from '@/assets/sfx/keyboard-soundpacks/nk-cream/config'
import { KeyboardSoundPackConfig } from '@/assets/sfx/keyboard-soundpacks/keyboard-soundpacks.type'

// Current Selected Font
export const useFont = () => useAtom(fontAtom)
export const fontAtom = atomWithStorage(LK.CURRENT_FONT_KEY, FONTS[2])

// Collection of user added fonts
export const useUserFonts = () => useAtom(userFontsAtom)
export const userFontsAtom = atomWithStorage<string[]>(LK.USER_FONTS_KEY, [])

// Current UI (Music only for now) Volume
export const useUiVolume = () => useAtom(uiVolumeAtom)
export const uiVolumeAtom = atomWithStorage<number>(LK.UI_VOLUME_KEY, 1)

// Current Keyboard Soundpack volume
export const useKeyboardVolume = () => useAtom(keyboardVolumeAtom)
export const keyboardVolumeAtom = atomWithStorage<number>(LK.KB_VOLUME_KEY, 1)

// Current Notifications volume
export const useNotificationsVolume = () => useAtom(notificationsVolumeAtom)
export const notificationsVolumeAtom = atomWithStorage<number>(
  LK.NOTIFICATIONS_VOLUME_KEY,
  1
)

// Current Selected Keyboard Soundpack
export const useKeyboardSound = () => useAtom(keyboardSoundAtom)
export const keyboardSoundAtom = atomWithStorage<KeyboardSoundPackConfig>(
  LK.KEYBOARD_SOUND_ATOM,
  nkCream
)
// Current TrackInfo (Playing Track & Playlist)
export type PlayerContext = {
  uri: string
  trackIdx: number
  playlistId: string
  shuffle: boolean
}
export const usePlayerContext = () => useAtom(playerContextAtom)
export const playerContextAtom = atomWithStorage<PlayerContext>(
  LK.PLAYER_CONTEXT_KEY,
  {
    uri: '',
    trackIdx: 0,
    playlistId: '',
    shuffle: false,
  }
)

//Current Selected Theme Color "Zinc", "Rose", "Yellow", etc
export const useColorStyle = () => useAtom(colorStyleAtom)
export const colorStyleAtom = atomWithStorage(
  LK.CURRENT_COLOR_STYLE_KEY,
  'Zinc'
)

// Current Selected Theme Color "Zinc", "Rose", "Yellow", etc
export const useCurrentThemeConfig = () => useAtom(currentThemeConfig)
export const currentThemeConfig = atom(themes[0])

// Current True Theme Mode (Light/Dark) being rendered
export const useTrueTheme = () => useAtom(trueThemeAtom)
export const trueThemeAtom = atom<'light' | 'dark'>('light')

// List of tracks being played currently
export const useTrackList = () => useAtom(trackListAtom)
export const trackListAtom = atom<SpotifyApi.PlaylistTrackObject[]>([])

// Computed value of the uri only of trackListAtom
export const useTrackUriList = () => useAtom(trackUriListAtom)
export const trackUriListAtom = atom((get) => {
  console.log('uri again')
  return get(trackListAtom).map((track) => track.track.uri)
})

// Current User Selected Theme Mode
export const useTheme = () => useAtom(themeAtom)
export const themeAtom = atomWithStorage<'light' | 'dark' | 'system'>(
  LK.CURRENT_THEME_KEY,
  'dark'
)
