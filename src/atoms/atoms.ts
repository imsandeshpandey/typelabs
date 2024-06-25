import { FONTS } from '@/config/fonts.config'
import * as LK from '@/config/local-storage-keys.config'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { nkCream } from '@/assets/sfx/keyboard-soundpacks/nk-cream/config'
import { KeyboardSoundPackConfig } from '@/assets/sfx/keyboard-soundpacks/keyboard-soundpacks.type'
import {
  CaretSmoothness,
  CaretStyle,
  DEFAULT_CARET_SMOOTHNESS,
  DEFAULT_CARET_STYLE,
} from '../config/caret.config'

// Current Selected Font
export const useFont = () => useAtom(fontAtom)
export const fontAtom = atomWithStorage<string>(LK.CURRENT_FONT_KEY, FONTS[2])

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

// List of tracks being played currently
export const useTrackList = () => useAtom(trackListAtom)
export const trackListAtom = atom<SpotifyApi.PlaylistTrackObject[]>([])

export const useGameConfig = () => useAtom(gameConfigAtom)
export const gameConfigAtom = atomWithStorage(LK.GAME_CONFIG_KEY, {
  time: 30,
})

export const styleAtom = atomWithStorage(LK.CURRENT_STYLE_KEY, 'carbon')
export const useStyle = () => useAtom(styleAtom)

export const fontSizeAtom = atomWithStorage(LK.FONT_SIZE_KEY, 24)
export const useFontSize = () => useAtom(fontSizeAtom)

export const caretStyleAtom = atomWithStorage<CaretStyle>(
  LK.CARET_STYLE_KEY,
  DEFAULT_CARET_STYLE
)
export const useCaretStyle = () => useAtom(caretStyleAtom)

export const caretSmoothnessAtom = atomWithStorage<CaretSmoothness>(
  LK.CARET_SMOOTHNESS_KEY,
  DEFAULT_CARET_SMOOTHNESS
)
export const useCaretSmoothness = () => useAtom(caretSmoothnessAtom)

export const borderRadiusAtom = atomWithStorage(LK.BORDER_RADIUS_KEY, 12)
export const useBorderRadius = () => useAtom(borderRadiusAtom)
