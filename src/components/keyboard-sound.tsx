import { useKeyboardVolume } from '@/state/atoms'
import { useEffect, useMemo } from 'react'
import keyConfig from 'public/keyboard-sounds/nk-cream/config'

export const KeyboardAudio = () => {
  const [volume] = useKeyboardVolume()

  const audioNames: Set<string> = useMemo(
    () => new Set(Object.values(keyConfig.defines)),
    []
  )

  useEffect(() => {
    for (const audioName of audioNames) {
      const audio = new Audio(getPath(audioName))
      audio.load()
    }
  }, [])

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

  return <></>
}

const getPath = (audioName: string) =>
  `${window.location.origin}/public/keyboard-sounds/nk-cream/${audioName}`
