import { useEffect, useState } from 'react'
import useSound from 'use-sound'

import { useKeyboardVolume } from '@/state/atoms'
import { KEYBOARD_SPRITES } from '@/config/sfx-sprite'

import keyConfig from '../../public/keyboard-sounds/config'
import keySounds from '../../public/keyboard-sounds/keyboard_sounds.wav'

export const VolumeReactiveKeyboardAudio = (props: { volume: number }) => {
  const [interacted, setInteracted] = useState(false)

  const [play] = useSound(keySounds, {
    volume: props.volume,
    sprite: KEYBOARD_SPRITES,
  })

  const handleKeyStroke = (e: KeyboardEvent) => {
    if (!interacted) setInteracted(true)
    const key = e.key as keyof typeof keyConfig.defines
    if (key in keyConfig.defines) {
      const audioName = keyConfig.defines[key]
      play({ id: audioName })
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyStroke)
    return () => document.removeEventListener('keydown', handleKeyStroke)
  }, [props.volume, interacted])

  return <></>
}

export const KeyboardAudio = () => {
  const [volume] = useKeyboardVolume()
  return <VolumeReactiveKeyboardAudio volume={volume} />
}
