import { MouseEventHandler, ReactNode, WheelEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Slider } from '../ui/slider'
import { PrimitiveAtom, useAtom } from 'jotai'

export const VolumeSlider = ({
  icon,
  atom,
  label,
}: {
  icon: ReactNode
  atom: PrimitiveAtom<number>
  label?: ReactNode
}) => {
  const [volume, setVolume] = useAtom(atom)
  const [lastVolume, setLastVolume] = useState(0)

  const updateVolume = (change: number) => {
    setVolume((prev) => {
      const newVol = prev + change
      if (newVol >= 1) return 1
      if (newVol <= 0) return 0
      return newVol
    })
  }

  const updateVolumeOnWheelEvent = (e: WheelEvent<HTMLDivElement>) => {
    const dY = e.deltaY
    const dX = dY > 0 ? -0.1 : 0.1
    updateVolume(dX)
  }

  const handleChange = (value: number[]) => {
    setVolume(value[0])
  }

  const toggleMute: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    if (volume == 0) {
      if (lastVolume == 0) return setVolume(0.5)
      return setVolume(lastVolume)
    }

    setLastVolume(volume)
    setVolume(0)
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="group flex flex-col items-start relative w-fit pr-2 rounded-md"
    >
      {!!label && (
        <p className=" text-xs flex gap-1 items-center select-none px-2 pt-2 text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex gap-2 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleMute}
              variant="ghost"
              className="p-2 rounded-md hover:bg-background/20"
              size="icon"
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="select-none">
            {volume == 0 ? 'Unmute' : 'Mute'}
          </TooltipContent>
        </Tooltip>

        <Slider
          tooltipContent={(volume * 100) >> 0}
          onWheelCapture={updateVolumeOnWheelEvent}
          className="w-24 cursor-pointer py-4"
          trackClassName="bg-background h-1 transition-all"
          thumbClassName="h-0 w-0 transition-all group-hover:h-4 group-hover:w-4"
          onValueChange={handleChange}
          max={1}
          value={[volume]}
          defaultValue={[0]}
          step={0.01}
        />
      </div>
    </div>
  )
}
