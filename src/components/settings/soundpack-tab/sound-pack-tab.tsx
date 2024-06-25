import { useKeyboardSound } from '@/atoms/atoms'
import { Setting } from '../setting'
import { SoundPackItem } from './sound-pack-item'
import { DEFAULT_SOUNDPACK, sounds } from '@/config/keyboard-soundpacks.config'

export const SoundPackTab = () => {
  const [, setSoundpack] = useKeyboardSound()
  return (
    <Setting
      title="Choose Soundpack"
      description={
        <>
          Some <b>Soundpacks</b> don't offer the same functionality as the
          others.
        </>
      }
      resetAction={() => setSoundpack(DEFAULT_SOUNDPACK)}
    >
      <div className="grid grid-cols-2 gap-4">
        {sounds.map((sound) => (
          <SoundPackItem
            key={sound.id}
            className="col-span-2 min-w-[12rem] md:col-span-1"
            soundPack={sound}
            title={sound.name}
          />
        ))}
      </div>
    </Setting>
  )
}
