import {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  WheelEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Button } from '@/components/ui/button'
import {
  ListPlus,
  Music4Icon,
  RotateCw,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './components/ui/tooltip'
import { ThemeSwitcher } from './components/theme-switcher'
import { ModeToggle } from './components/mode-toggle'
import {
  ChevronUpIcon,
  KeyboardIcon,
  SpeakerLoudIcon,
} from '@radix-ui/react-icons'
import { FontSelect } from './components/font-select'
import { Slider } from './components/ui/slider'
import {
  keyboardVolumeAtom,
  musicVolumeAtom,
  uiVolumeAtom,
} from './state/atoms'
import { TextArea } from './components/text-area'
import { useHotkeys } from 'react-hotkeys-hook'
import { PrimitiveAtom, useAtom } from 'jotai'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu'
import { useEngine } from './components/engine-provider'
import { useTimer } from './providers/timer-provider'
import { Shortcut } from './components/ui/shortcut'
import { Box } from './components/ui/box'
import CountUp from 'react-countup'

function App() {
  const pauseTimer = useTimer('pauseTimer')
  const restart = useEngine('restart')

  const generateText = useEngine('generateText')
  const setFocus = useEngine('setTextAreaFocus')

  const hasTimerEnded = useTimer('hasTimerEnded')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setShowResults(hasTimerEnded)
  }, [hasTimerEnded])

  useEffect(() => {
    addEventListener('mousemove', pauseTimer)
    return () => removeEventListener('mousemove', pauseTimer)
  }, [])

  const CurrentView = showResults ? Results : TextArea

  useHotkeys('ctrl+space', () => {
    generateText()
    setShowResults(false)
  })
  useHotkeys('ctrl+enter', () => {
    restart()
    setShowResults(false)
  })

  return (
    <div className="h-screen max-w-[1200px] w-[calc(100%-64px)] md:w-[80%] mx-auto flex flex-col">
      <div className="flex items-center py-4 justify-between w-full ">
        <h1 className="text-2xl flex gap-2 items-start font-robotoMono select-none underline text-muted-foreground font-semibold">
          <KeyboardIcon className="w-10 h-10 text-primary " />
          typelabs
        </h1>
        <Box gameResponsive className="flex gap-16 items-center">
          <ThemeSwitcher />
          <ModeToggle />
        </Box>
      </div>

      <Box
        onClickOutside={() => setFocus(false)}
        onMouseLeave={() => pauseTimer()}
        onClick={() => setFocus(true)}
        className="flex-1 flex flex-col justify-center focus:outline-none relative"
      >
        <CurrentView />
        <div className="flex text-sm gap-2 justify-center">
          <BottomButton
            label="Restart"
            icon={<RotateCw className="h-4 w-4" />}
            shortcut={<Shortcut mac="⌘ + Enter" win="Ctrl + Enter" />}
            onClick={(e) => {
              e.currentTarget.blur()
              setShowResults(false)
              restart()
            }}
          />
          <BottomButton
            label="New"
            icon={<ListPlus className="h-4 w-4" />}
            shortcut={<Shortcut mac="⌘ + Space" win="Ctrl + Space" />}
            onClick={(e) => {
              e.currentTarget.blur()
              setShowResults(false)
              generateText()
            }}
          />
        </div>
      </Box>
      <Box gameResponsive className="py-2 flex w-full items-end gap-2">
        <FontSelect />
        <VolumeControls />
      </Box>
    </div>
  )
}

export default App

const Results = () => {
  const errorPercentage = useEngine('errorPercentage')
  const wpm = useEngine('wpm')
  const rawWpm = useEngine('rawWpm')

  return (
    <div className="flex flex-col w-full lg:w-[900px] sm:mx-auto gap-2 mb-10 animate-in zoom-in-90">
      <h1 className="font-bold text-lg text-muted-foreground mb-4">Results</h1>
      <div className="flex justify-between w-full gap-10">
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">raw wpm</h3>
            <p className="font-bold text-5xl text-primary">
              <CountUp end={rawWpm >> 0} duration={2} />
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">wpm</h3>
            <p className="font-bold text-5xl text-primary">
              <CountUp end={wpm >> 0} duration={2} />
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">acc</h3>
            <p className="font-bold text-5xl text-primary">
              <CountUp end={100 - errorPercentage} duration={2} />%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ICONS = [VolumeX, Volume1, Volume2]

const VolumeControls = () => {
  const [volume, setVolume] = useAtom(uiVolumeAtom)

  const getIndex = useCallback(() => {
    if (volume == 0) return 0
    if (volume > 0.5) return 2

    return 1
  }, [volume])

  const updateVolume = (change: number) => {
    setVolume((prev) => {
      const newVol = prev + change
      if (newVol >= 1) return 1
      if (newVol <= 0) return 0
      return newVol
    })
  }

  useHotkeys('up', () => updateVolume(0.1))
  useHotkeys('down', () => updateVolume(-0.1))

  useEffect(() => {
    const Icon = ICONS[getIndex()]
    setIcon(<Icon className="w-5 h-5" />)
  }, [volume])

  const [icon, setIcon] = useState(<SpeakerLoudIcon className="w-8 h-8" />)

  return (
    <DropdownMenu>
      <div className="flex items-end">
        <VolumeSlider label="Volume" icon={icon} atom={uiVolumeAtom} />
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-3 w-fit h-fit"
          >
            <ChevronUpIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <VolumeSlider
            label="Music"
            icon={<Music4Icon className="w-4 h-4" />}
            atom={musicVolumeAtom}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <VolumeSlider
            label="Keyboard"
            icon={<KeyboardIcon className="w-4 h-4" />}
            atom={keyboardVolumeAtom}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <VolumeSlider label="Volume" icon={icon} atom={uiVolumeAtom} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const VolumeSlider = ({
  icon,
  atom,
  label,
}: {
  icon: ReactNode
  atom: PrimitiveAtom<number>
  label: string
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
      <p className=" text-xs select-none px-2 pt-2 text-muted-foreground">
        {label}
      </p>
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

type BottomButton = {
  label: string
  icon: React.ReactNode
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  shortcut: ReactNode
}

const BottomButton = (props: BottomButton) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={props.onClick}
          variant="ghost"
          className="gap-2 pointer text-md text-muted-foreground"
        >
          {props.icon} {props.label}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-transparent shadow-none border-none">
        <div className="flex gap-1 w-fit mx-auto">{props.shortcut}</div>
      </TooltipContent>
    </Tooltip>
  )
}
