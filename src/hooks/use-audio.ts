import success from '@/assets/sfx/success.wav'
import error from '@/assets/sfx/error.wav'
import neutral from '@/assets/sfx/neutral.mp3'
import click from '@/assets/sfx/click.wav'
import del from '@/assets/sfx/delete.mp3'

import { useUiVolume } from '@/state/atoms'

type sfx = 'error' | 'success' | 'neutral' | 'click' | 'delete'

const AUDIO_MAP = { error, success, neutral, click, delete: del }

export const useAudio = () => {
  const [uiVol] = useUiVolume()
  const play = (sfx: sfx, volume?: number) => {
    const audio = new Audio(AUDIO_MAP[sfx])
    audio.volume = volume || uiVol
    audio.play()
  }
  return play
}
