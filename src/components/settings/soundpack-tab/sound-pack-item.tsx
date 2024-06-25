import { useKeyboardSound } from '@/atoms/atoms'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KeyboardSoundPackConfig } from '@/assets/sfx/keyboard-soundpacks/keyboard-soundpacks.type'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
  RadioCardProps,
} from '../../ui/radio-card'

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
          'font-bold text-muted-foreground',
          isActive && 'text-foregrond'
        )}
      >
        {title}
      </RadioCardDescription>
      <RadioCardContent>
        <p
          className={cn(
            'flex items-center gap-2 text-xs text-muted-foreground',
            {
              'text-foreground': isActive,
            }
          )}
        >
          Includes Numpad:
          {soundPack.includes_numpad ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </p>
      </RadioCardContent>
    </RadioCard>
  )
}
