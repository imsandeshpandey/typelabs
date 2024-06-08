import React from 'react'
import { ChevronUp, Loader2, Music2Icon } from 'lucide-react'
import sf from 'seconds-formater'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import spotifyIcon from '@/assets/svgs/spotify-icon.svg'
import { useSpotifyAuth } from '@/providers/spotify-auth.provider'

sf.change('MM:SS')

const AUTH_PARAMS = new URLSearchParams({
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: 'code',
  scope:
    'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative',
})

const AUTH_URL = `https://accounts.spotify.com/authorize?${AUTH_PARAMS.toString()}`

export const ConnectSpotifyButton = () => {
  const { user, accessToken } = useSpotifyAuth()

  let content = (
    <a href={AUTH_URL} className="flex gap-2 items-center">
      <img className="h-4 w-4" src={spotifyIcon} /> Connect Spotify
    </a>
  )

  if (user.isLoading && accessToken) {
    content = (
      <>
        <img className="h-4 w-4" src={spotifyIcon} />
        Loading
        <Loader2 className="animate-spin h-4 w-4" />
      </>
    )
  }
  if (user.data) {
    const userImage = user.data.images?.[0].url
    content = (
      <>
        <img
          className={cn('h-4 w-4 rounded-full mr-1', {
            'outline-offset-2 outline-1 outline outline-primary h-6 w-6':
              userImage,
          })}
          src={user.data.images?.[0].url || spotifyIcon}
        />
        <div className="flex items-center gap-1">
          {user.data?.display_name}
          <Music2Icon className="text-muted-foreground h-4 w-4" />
        </div>
        <ChevronUp className="h-4 w-4" />
      </>
    )
  }

  return (
    <Button variant="ghost" className="grouprelative gap-2 items-center">
      {content}
    </Button>
  )
}
