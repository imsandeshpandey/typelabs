import { useUiVolume } from '@/state/atoms'

import uiSounds from '@/assets/sfx/ui-sounds.wav'
import useSound from 'use-sound'

type sfx = 'error' | 'success' | 'neutral' | 'click' | 'delete'

const sounds = ['error', 'success', 'neutral', 'click', 'delete']

export const useSoundFx = () => {
  const [vol] = useUiVolume()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { sound }] = useSound(uiSounds, {
    sprite: {
      click: [0, 1000],
      delete: [1000, 430],
      error: [1430, 1000],
      neutral: [2430, 1593],
      success: [4023, 1000],
    },
  })

  const play = (soundName: sfx, volume: number) => {
    if (sounds.includes(soundName)) {
      sound?.volume(volume || vol)
      sound?.play(soundName)
    } else {
      console.error(`Sound ${soundName} not found`)
    }
  }

  return play
}
