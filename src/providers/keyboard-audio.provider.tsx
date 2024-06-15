import { useEffect, useMemo, useState } from 'react'
import { useKeyboardSound, useKeyboardVolume } from '@/atoms/atoms'
import { Howl } from 'howler'
import { sounds } from '../config/keyboard-soundpacks.config'

export const KeyboardAudioProvider = () => {
  const howls = useMemo(
    () =>
      Object.fromEntries(
        sounds.map((sound) => {
          const howl = new Howl({
            src: [sound.sound],
            sprite: sound.sprites,
          })
          return [sound.name, howl]
        })
      ),
    []
  )
  const [volume] = useKeyboardVolume()
  const [soundPack] = useKeyboardSound()
  const [interacted, setInteracted] = useState(false)

  const sound = howls[soundPack.name]

  const handleKeyStroke = (e: KeyboardEvent) => {
    if (!interacted) setInteracted(true)
    let key = e.code
    // When pressed right after a letter, sometimes "Space" has a different keycode
    if (!key && e.key == ' ') key = 'Space'
    if (key in soundPack.sprites) {
      sound.volume(volume)
      sound.play(key)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyStroke)
    return () => document.removeEventListener('keydown', handleKeyStroke)
  }, [volume, interacted, soundPack.id])

  return <></>
}
