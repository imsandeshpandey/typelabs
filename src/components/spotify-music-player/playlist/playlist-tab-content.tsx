import { Button } from '@/components/ui/button'
import { AlertTriangle, Shuffle } from 'lucide-react'
import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { PlaylistTabContentSkeleton } from './playlist-tab-content.skeleton'
import { TrackItemCollection } from '@/components/spotify-music-player/track/track-item-collection'
import { usePlayerContext } from '@/atoms/atoms'
import { usePlaylist } from '@/react-query/queries/playlist.query'
import { PlayIcon } from '@radix-ui/react-icons'
import { Toggle } from '@/components/ui/toggle'
import {
  usePlaybackState,
  usePlayerDevice,
} from 'react-spotify-web-playback-sdk'
import { spotifyClient } from '@/config/spotify-client.config'
import useOptimistic from '@/hooks/use-optimistic.hook'
import { usePlayTrack } from '@/react-query/mutations/play-track.mutation'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useQuery } from '@tanstack/react-query'

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

  if (isLoading && activePlaylist) return <PlaylistTabContentSkeleton />

  if (error) {
    return (
      <div className="flex items-center gap-4 justify-center  text-lg w-full">
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
    <div className="flex flex-col gap-4 h-full w-full transition-all animate-in in">
      <header
        style={{
          backgroundImage: `linear-gradient(transparent,hsla(var(--background))), url(${playlistCoverUrl})`,
        }}
        className="relative overflow-hidden w-full h-[13rem] min-w-[22rem] bg-cover bg-center flex items-end px-4 py-2"
      >
        <div className="flex gap-2">
          <div>
            <h2 className="text-xl font-bold">{playlist?.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Avatar className="h-6 w-6">
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
          <Button
            onClick={handlePlaylistPlay}
            size="icon"
            className="rounded-full"
          >
            <PlayIcon className="h-6 w-6 stroke-primary-foreground stroke-[0.5]" />
          </Button>
        </div>
      </header>
      <ShuffleToggle />
      {!!playlist && <TrackItemCollection playlist={playlist!} />}
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
      className="gap-2 ml-4 outline text-sm outline-muted w-fit hover:bg-foreground/5 hover:text-initial outline-2 backdrop-blur-sm data-[state=on]:!text-foreground data-[state=on]:outline-primary data-[state=on]:outline data-[state=on]:bg-primary/30"
    >
      <Shuffle className="h-4 w-4" />
      Shuffle
    </Toggle>
  )
}
