import { useEffect, useState } from 'react'
import { ListPlus, RotateCw } from 'lucide-react'
import { ModeToggle } from './components/mode-toggle'
import { KeyboardIcon } from '@radix-ui/react-icons'
import { TextArea } from './components/text-area'
import { useHotkeys } from 'react-hotkeys-hook'
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
import { useTimer } from './global-state/timer.store'
import { useEngine } from './global-state/game-engine.store'

function App() {
  const { hasTimerEnded, pauseTimer } = useTimer('hasTimerEnded', 'pauseTimer')
  const {
    setTextAreaFocus: setFocus,
    generateText,
    restart,
  } = useEngine('generateText', 'setTextAreaFocus', 'restart')

  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setShowResults(hasTimerEnded)
  }, [hasTimerEnded])

  useEffect(() => {
    addEventListener('mousemove', pauseTimer)
    return () => removeEventListener('mousemove', pauseTimer)
  }, [])

  useHotkeys(KEYBINDS.NEW_GAME.hotkey, () => {
    generateText()
    setShowResults(false)
  })
  useHotkeys(KEYBINDS.RESTART.hotkey, () => {
    restart()
    setShowResults(false)
  })

  const CurrentView = showResults ? Results : TextArea
  return (
    <div className="mx-auto flex h-screen w-[calc(100%-64px)] max-w-[1200px] flex-col md:w-[80%]">
      <div className="flex w-full items-center justify-between py-4">
        <h1 className="flex select-none items-start gap-2 font-robotoMono text-2xl font-semibold text-muted-foreground">
          <KeyboardIcon className="h-10 w-10 text-primary" />
          typelabs
        </h1>
        <Box gameResponsive className="flex items-center gap-4">
          <SettingsDialog />
          <ModeToggle />
        </Box>
      </div>

      <Box
        onClickOutside={() => setFocus(false)}
        onMouseLeave={() => pauseTimer()}
        onClick={() => setFocus(true)}
        className="duration-400 relative flex flex-1 flex-col justify-center transition-all animate-in fade-in-0 slide-in-from-bottom-10 focus:outline-none"
      >
        <div className="max-w-full">
          <CurrentView />
        </div>
        <div className="flex justify-center gap-2 text-sm">
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
      <Box gameResponsive className="flex w-full items-end gap-2 py-2">
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
