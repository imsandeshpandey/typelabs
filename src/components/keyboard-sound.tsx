import { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { useKeyboardSound, useKeyboardVolume } from '@/state/atoms'
import { Config, nkCream } from '@/assets/sfx/nk-cream/config'
import { egOreo } from '@/assets/sfx/eg-oreo/config'
import { KeyboardIcon } from '@radix-ui/react-icons'
import { Howl } from 'howler'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const sounds = [nkCream, egOreo]

export const KeyboardAudio = () => {
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
    const key = e.code
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

export const KeyboardSoundPackSelector = () => {
  const [sound] = useKeyboardSound()
  return (
    <Dialog>
      <div>
        <p className="text-xs flex gap-1 items-center text-muted-foreground px-3">
          <KeyboardIcon /> Soundpack
        </p>
        <DialogTrigger>
          <Button variant="ghost" className="gap-4">
            {sound.name}{' '}
            <ChevronDown className="h-4 text-muted-foreground w-4" />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Keyboard SoundPack</DialogTitle>
          <DialogDescription>
            Not all <span className="font-bold">SoundPacks</span> are equal.
            Some don't offer the functionality that others do.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-4">
          {sounds.map((s) => (
            <SoundPackItem soundPack={s}>{s.name}</SoundPackItem>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

type SoundPackItemProps = HTMLAttributes<HTMLDivElement> & {
  soundPack: Config
}

export const SoundPackItem = (props: SoundPackItemProps) => {
  const [currentSoundPack, setSoundPack] = useKeyboardSound()
  const isActive = props.soundPack.id === currentSoundPack.id
  return (
    <button
      onClick={() => {
        setSoundPack(props.soundPack)
      }}
      className={cn(
        'w-40 flex-grow flex flex-col transition-colors h-fit px-4 py-2 outline outline-1 outline-border rounded-lg hover:outline-foreground/20 hover:bg-foreground/5',
        {
          'outline-primary outline-2 bg-primary/10 hover:outline-intial hover:bg-initial ':
            isActive,
        }
      )}
    >
      <h1 className="text-lg mb-1 font-semibold">{props.children}</h1>
      <p
        className={cn('text-muted-foreground flex items-center gap-2 text-xs', {
          'text-foreground': isActive,
        })}
      >
        Includes Numpad:
        {props.soundPack.includes_numpad ? (
          <Check className="w-4 h-4" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </p>
    </button>
  )
}
