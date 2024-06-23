import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import sf from 'seconds-formater'
import { Theme } from '@/styles/themes/theme.type'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function getOS(): string {
  const osPatterns: Record<string, RegExp> = {
    windows: /Windows NT|Win/,
    mac: /Macintosh|Mac OS X|MacPPC|MacIntel|Mac OS/,
    linux: /Linux|X11/,
    android: /Android/,
    ios: /iPhone|iPad|iPod/,
    unix: /Unix/,
    blackberry: /BlackBerry|BB/,
    webos: /webOS|hpwOS/,
  }

  for (const [os, pattern] of Object.entries(osPatterns)) {
    if (pattern.test(window.navigator.userAgent)) {
      return os
    }
  }

  return 'Unknown'
}

export function generateFontCss(font: string): string {
  return `${font},Roboto Mono,monospace,-apple-system,system-ui,Avenir,Helvetica,Arial,sans-serif`
}

export const trim = (s: string): string => s.trim()

export const sf_s = (time: number) => sf.convert(time).format('MM:SS')
export const sf_ms = (time: number) => sf.convert(time / 1000).format('MM:SS')

export const getTrackKey = (
  track: SpotifyApi.TrackObjectFull | Spotify.Track
) => `${track?.name}-${track?.album.name}-${track?.artists[0].name}`

export const formatThemeName = (name: string) => {
  let formattedName = name.replace(/_/g, ' ')
  formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
  return formattedName
}

export const getTrackUrl = (id: string) =>
  `https://open.spotify.com/track/${id}`

export const getAlbumUrl = (id: string) =>
  `https://open.spotify.com/album/${id}`

export const getArtistUrl = (id: string) =>
  `https://open.spotify.com/artist/${id}`
export const applyTheme = (style: string) => {
  console.log(style)
  import(`@/styles/themes/theme_${style}.ts`)
    .then((module) => module['theme_' + style])
    .then((theme) => {
      const root = document.documentElement
      Object.keys(theme).forEach((key) => {
        root.style.setProperty(key, theme[key as keyof Theme])
      })
    })
}
