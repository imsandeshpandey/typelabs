import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import './styles/themes.css'
import { ThemeProvider } from './providers/theme-provider.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { EngineProvider } from './components/engine-provider.tsx'
import { TimerProvider } from './providers/timer-provider.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { UserAgentProvider } from '@quentin-sommer/react-useragent'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserAgentProvider ua={window.navigator.userAgent}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider delayDuration={100}>
          <App />
          <Toaster />
          <TimerProvider />
          <EngineProvider />
        </TooltipProvider>
      </ThemeProvider>
    </UserAgentProvider>
  </React.StrictMode>
)
