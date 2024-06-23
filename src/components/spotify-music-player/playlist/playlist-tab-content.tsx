import { Button } from '@/components/ui/button'
import { AlertTriangle, Play, Shuffle } from 'lucide-react'
import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { PlaylistTabContentSkeleton } from './playlist-tab-content.skeleton'
import { TrackItemCollection } from '@/components/spotify-music-player/track/track-item-collection'
import { usePlayerContext } from '@/atoms/atoms'
import { usePlaylist } from '@/react-query/queries/playlist.query'
import { Toggle } from '@/components/ui/toggle'
import {
  usePlaybackState,
  usePlayerDevice,
} from 'react-spotify-web-playback-sdk'
import { spotifyClient } from '@/config/spotify-client.config'
import useOptimistic from '@/hooks/use-optimistic.hook'
import { usePlayTrack } from '@/react-query/mutations/play-track.mutation'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

type PlaylistTabContentProps = {
  activePlaylist: string
}

export const PlaylistTabContent = ({
  activePlaylist,
}: PlaylistTabContentProps) => {
  const [playerContext, setPlayerContext] = usePlayerContext()
  const { data: playlist, error, isLoading } = usePlaylist(activePlaylist)
  const { mutate: play } = usePlayTrack()
  const device = usePlayerDevice()
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const { data: owner, refetch } = useQuery({
    queryKey: ['user', playlist?.owner.id],
    queryFn: () => spotifyClient.getUser(playlist?.owner.id || ''),
  })
  useEffect(() => {
    if (!playlist) return
    refetch()
  }, [playlist])

  const handlePlaylistPlay = () => {
    if (!playlist) return
    const newContext = {
      ...playerContext,
      uri: playlist.uri,
      playlistId: playlist.id,
      trackIdx: 0,
    }
    if (!device?.device_id) return
    play({ device_id: device.device_id, context_uri: playlist.uri })
    setPlayerContext(newContext)
  }
  const [scrollStartIndex, setScrollStartIndex] = useState<number>(0)
  const isScrolled = scrollStartIndex > 3
  if (isLoading && activePlaylist) return <PlaylistTabContentSkeleton />

  if (error) {
    return (
      <div className="flex w-full items-center justify-center gap-4 text-lg">
        <AlertTriangle className="h-10 w-10 text-rose-500" />
        <h2>
          Error loading the playlist.
          <br /> Try refreshing the page or try again later.
        </h2>
      </div>
    )
  }
  const playlistCoverUrl = playlist?.images?.[0].url || defaultPlaylistIcon
  return (
    <div className="sm:min-w-auto relative flex h-full w-full flex-col gap-4 animate-in">
      <img
        src={playlistCoverUrl}
        className="absolute -z-20 h-1/2 blur-[140px]"
      />
      <header className="relative flex w-full min-w-[22rem] items-end gap-3 bg-cover bg-center px-4 py-2">
        <img
          src={playlistCoverUrl}
          alt={playlist?.name}
          className={cn(
            'z-10 aspect-square h-24 shadow-xl transition-all md:h-[10rem] lg:h-[12rem]',
            isScrolled && 'h-14 md:h-14 lg:h-14'
          )}
        />

        <div>
          <div
            className={cn(
              'mb-1 flex flex-col gap-1 transition-all',
              isScrolled && 'gap-0'
            )}
          >
            <p
              className={cn(
                'text-sm text-muted-foreground transition-all',
                isScrolled && 'text-xs md:text-xs lg:text-xs'
              )}
            >
              Playlist
            </p>
            <h2
              className={cn(
                'text-xl font-bold transition-all md:text-3xl lg:text-4xl',
                isScrolled && 'text-md md:text-lg lg:text-lg'
              )}
            >
              {playlist?.name}
            </h2>
            <p
              ref={descriptionRef}
              className={cn(
                'group my-1 line-clamp-2 text-xs text-muted-foreground transition-all animate-in slide-in-from-left-10 lg:line-clamp-3 xl:line-clamp-none',
                isScrolled && 'hidden md:hidden lg:hidden xl:hidden'
              )}
            >
              {playlist?.description}
            </p>
          </div>
          <p
            className={cn(
              'flex items-center gap-1 text-sm text-muted-foreground animate-in slide-in-from-left-10',
              isScrolled && 'text-xs md:text-xs lg:text-xs'
            )}
          >
            <Avatar className={cn('h-6 w-6', isScrolled && 'h-4 w-4')}>
              <AvatarImage
                className="object-cover"
                src={owner?.images?.[0]?.url}
              />
              <AvatarFallback>
                {playlist?.owner.display_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            {playlist?.owner?.display_name} • {playlist?.tracks?.total} tracks
          </p>
        </div>
      </header>
      <div className="flex w-full items-end gap-4 px-4">
        <Button
          onClick={handlePlaylistPlay}
          size="icon"
          className="gap-2 rounded-full bg-primary font-semibold"
          tooltipContent="Play Playlist"
        >
          <Play className="h-4 w-4 fill-black stroke-primary-foreground stroke-[1]" />
        </Button>
        <ShuffleToggle />
      </div>
      {!!playlist && (
        <TrackItemCollection
          onScrolled={setScrollStartIndex}
          playlist={playlist!}
        />
      )}
    </div>
  )
}

const ShuffleToggle = () => {
  const state = usePlaybackState()
  const [, setContext] = usePlayerContext()
  const updateShuffle = (value: boolean) => spotifyClient.setShuffle(value)
  const [shuffle, setShuffle] = useOptimistic<boolean>(
    !!state?.shuffle,
    updateShuffle
  )

  useEffect(() => {
    setContext((state) => ({ ...state, shuffle }))
  }, [shuffle])

  return (
    <Toggle
      pressed={shuffle}
      onPressedChange={setShuffle}
      size="sm"
      className="hover:text-initial h-fit w-fit gap-2 rounded-full py-1 text-xs outline outline-2 outline-foreground/20 backdrop-blur-sm hover:bg-foreground/5 data-[state=on]:bg-primary/30 data-[state=on]:!text-foreground data-[state=on]:outline data-[state=on]:outline-primary"
    >
      <Shuffle className="h-4 w-4" />
      Shuffle
    </Toggle>
  )
}
