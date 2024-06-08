import { useKeyboardSound } from '@/state/atoms'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KeyboardSoundPackConfig } from '@/assets/sfx/keyboard-soundpacks/keyboard-soundpacks.type'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
  RadioCardProps,
} from '../ui/radio-card'

export type SoundPackItemProps = Omit<RadioCardProps, 'isActive'> & {
  soundPack: KeyboardSoundPackConfig
  title: string
}
export const SoundPackItem = ({
  soundPack,
  title,
  ...props
}: SoundPackItemProps) => {
  const [currentSoundPack, setSoundPack] = useKeyboardSound()
  const isActive = soundPack.id === currentSoundPack.id
  return (
    <RadioCard
      onClick={() => {
        setSoundPack(soundPack)
      }}
      isActive={isActive}
      {...props}
    >
      <RadioCardDescription
        className={cn(
          'text-muted-foreground font-bold',
          isActive && 'text-foregrond'
        )}
      >
        {title}
      </RadioCardDescription>
      <RadioCardContent>
        <p
          className={cn(
            'text-muted-foreground flex items-center gap-2 text-xs',
            {
              'text-foreground': isActive,
            }
          )}
        >
          Includes Numpad:
          {soundPack.includes_numpad ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </p>
      </RadioCardContent>
    </RadioCard>
  )
}
