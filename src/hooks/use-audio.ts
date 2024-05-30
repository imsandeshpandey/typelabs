import { useUiVolume } from '@/state/atoms'
import { useEffect } from 'react'

import success from '@/assets/sfx/success.wav'
import error from '@/assets/sfx/error.wav'
import neutral from '@/assets/sfx/neutral.mp3'
import click from '@/assets/sfx/click.wav'
import del from '@/assets/sfx/delete.mp3'

type sfx = 'error' | 'success' | 'neutral' | 'click' | 'delete'

const sounds = { error, success, neutral, click, delete: del }

export const useAudio = () => {
  const [volume] = useUiVolume()
  useEffect(() => {
    for (const sound of Object.keys(sounds) as sfx[]) {
      const audio = new Audio(sounds[sound])
      audio.load()
    }
  }, [])

  const play = (soundName: sfx) => {
    if (sounds[soundName]) {
      const audio = new Audio(sounds[soundName])
      audio.volume = volume
      audio.play()
    } else {
      console.error(`Sound ${soundName} not found`)
    }
  }

  return play
}
