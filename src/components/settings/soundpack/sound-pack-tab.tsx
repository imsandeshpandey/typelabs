import { SoundPackItem } from '../sound-pack-item'
import { sounds } from '@/config/keyboard-soundpacks.config'

export const SoundPackTab = () => {
  return (
    <>
      <p className="-mt-3 text-muted-foreground">
        Some <b>Soundpacks</b> don't offer the same functionality as the others.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {sounds.map((sound) => (
          <SoundPackItem
            key={sound.id}
            className="col-span-2 min-w-[12rem] md:col-span-1"
            soundPack={sound}
            title={sound.name}
          />
        ))}
      </div>
    </>
  )
}
