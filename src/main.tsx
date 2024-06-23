import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { EngineProvider } from './providers/engine.provider.tsx'
import { TimerProvider } from './providers/timer.provider.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { KeyboardAudioProvider } from './providers/keyboard-audio.provider.tsx'
import './styles/themes.css'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  SpotifyAuthProvider,
  useSpotifyAuth,
} from './providers/spotify-auth.provider.tsx'
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk'
import { useCallback } from 'react'
import { UI_VOLUME_KEY } from './config/local-storage-keys.config.ts'
import { queryClient } from './config/react-query.config.ts'
import { StyleProvider } from './providers/style-provider.tsx'

export const PlayerProvider = (props: { children: React.ReactNode }) => {
  const { user, accessToken } = useSpotifyAuth()

  const getOAuthToken = useCallback(
    (callback: (accessToken: string) => void) => {
      callback(accessToken)
    },
    [accessToken]
  )

  return (
    <WebPlaybackSDK
      getOAuthToken={getOAuthToken}
      initialDeviceName={`${user.data?.display_name}'s typelabs`}
      initialVolume={+(localStorage.getItem(UI_VOLUME_KEY) || 0.5)}
      connectOnInitialized={true}
    >
      {props.children}
    </WebPlaybackSDK>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StyleProvider />
    <SpotifyAuthProvider>
      <PlayerProvider>
        <TooltipProvider delayDuration={100}>
          <App />
          <Toaster />
          <TimerProvider />
          <EngineProvider />
          <KeyboardAudioProvider />
        </TooltipProvider>
      </PlayerProvider>
    </SpotifyAuthProvider>
  </QueryClientProvider>
)
