import { useKeyboardVolume } from '@/state/atoms'
import { useEffect } from 'react'
import keyConfig from '@/assets/keyboard-sounds/nk-cream/config'

export const KeyboardAudio = () => {
  const [volume] = useKeyboardVolume()

  const handleKeyStroke = (e: KeyboardEvent) => {
    const key = e.key as keyof typeof keyConfig.defines
    if (key in keyConfig.defines) {
      const audioName = keyConfig.defines[key]
      const audio = new Audio(getPath(audioName))
      audio.volume = volume
      audio.play()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyStroke)
    return () => document.removeEventListener('keydown', handleKeyStroke)
  }, [volume])

  useEffect(() => {}, [])
  return <></>
}

const getPath = (audioName: string) =>
  `src/assets/keyboard-sounds/nk-cream/${audioName}`
