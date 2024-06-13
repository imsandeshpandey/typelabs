import { useEffect, useState } from 'react'
import { ListPlus, RotateCw } from 'lucide-react'
import { ModeToggle } from './components/mode-toggle'
import { KeyboardIcon } from '@radix-ui/react-icons'
import { TextArea } from './components/text-area'
import { useHotkeys } from 'react-hotkeys-hook'
import { useEngine } from './providers/engine.provider'
import { useTimer } from './providers/timer.provider'
import { Box } from './components/ui/box'
import { KEYBINDS } from './config/keybinds.config'
import { ConnectSpotifyButton } from './components/spotify-music-player/connect-spotify-button'
import { SpotifyDrawer } from './components/spotify-music-player/spotify-drawer'
import { SettingsDialog } from './components/settings/settings-button'
import { Results } from './components/results'
import { VolumeControls } from './components/volume/volume-control-popover'
import { GameButton } from './components/game-button'
import { useSpotifyAuth } from './providers/spotify-auth.provider'
import { NoSpotifyPremiumButton } from './components/no-spotify-premium-button'

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

  useHotkeys(KEYBINDS.NEW_GAME.hotkey, () => {
    generateText()
    setShowResults(false)
  })
  useHotkeys(KEYBINDS.RESTART.hotkey, () => {
    restart()
    setShowResults(false)
  })
  return (
    <div className="h-screen max-w-[1200px] w-[calc(100%-64px)] md:w-[80%] mx-auto flex flex-col">
      <div className="flex items-center py-4 justify-between w-full ">
        <h1 className="text-2xl flex gap-2 items-start font-robotoMono select-none text-muted-foreground font-semibold">
          <KeyboardIcon className="w-10 h-10 text-primary " />
          typelabs
        </h1>
        <Box gameResponsive className="flex gap-4 items-center">
          <SettingsDialog />
          <ModeToggle />
        </Box>
      </div>

      <Box
        onClickOutside={() => setFocus(false)}
        onMouseLeave={() => pauseTimer()}
        onClick={() => setFocus(true)}
        className="flex-1 flex flex-col justify-center focus:outline-none relative"
      >
        <div className="max-w-full">
          <CurrentView />
        </div>
        <div className="flex text-sm gap-2 justify-center">
          <GameButton
            label="Restart"
            icon={<RotateCw className="h-4 w-4" />}
            shortcut={KEYBINDS.RESTART.label}
            onClick={(e) => {
              e.currentTarget.blur()
              setShowResults(false)
              restart()
            }}
          />
          <GameButton
            label="New"
            icon={<ListPlus className="h-4 w-4" />}
            shortcut={KEYBINDS.NEW_GAME.label}
            onClick={(e) => {
              e.currentTarget.blur()
              setShowResults(false)
              generateText()
            }}
          />
        </div>
      </Box>
      <Box gameResponsive className="py-2 flex w-full items-end gap-2">
        <VolumeControls />
        <SpotifyPlayer />
      </Box>
    </div>
  )
}

export default App

const SpotifyPlayer = () => {
  const { user } = useSpotifyAuth()
  if (!user.data) {
    return <ConnectSpotifyButton />
  }
  if (user.data?.product !== 'premium') {
    return <NoSpotifyPremiumButton />
  }
  return <SpotifyDrawer />
}
