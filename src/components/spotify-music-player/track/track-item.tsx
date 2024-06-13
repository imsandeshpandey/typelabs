import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { cn } from '@/lib/utils'
import { Pause, Play } from 'lucide-react'
import {
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
} from 'react-spotify-web-playback-sdk'
import sf from 'seconds-formater'
import { useCurrentTrackInfo } from '@/atoms/atoms'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatedPlayIcon } from '@/components/compound-ui/animated-play-icon'
import { spotifyClient } from '@/config/spotify-client.config'
import { Box } from '@/components/ui/box'

export type TrackItemProps = {
  track: SpotifyApi.TrackObjectFull
  index: number
  playlist: SpotifyApi.PlaylistObjectFull
  isActive: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
export const useOptimisticState = <T extends any>(initialState: T) => {
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  return [state, setState] as const
}

export const TrackItem: FC<TrackItemProps> = ({ track, index, playlist }) => {
  const playbackState = usePlaybackState(true, 100)
  const player = useSpotifyPlayer()
  const device = usePlayerDevice()
  const [currentTrackInfo, setCurrentTrackInfo] = useCurrentTrackInfo()
  const [isHovered, setIsHovered] = useState(false)
  const artistName = track.artists?.[0]?.name
  const imageUrl = track.album.images?.[1]?.url || defaultPlaylistIcon
  const trackDuration = useMemo(
    () => sf.convert(track.duration_ms / 1000).format(),
    [track.duration_ms]
  )
  const [isActive, setIsActive] = useOptimisticState(
    track.uri === playbackState?.track_window.current_track?.uri &&
      currentTrackInfo.playlistId === playlist.id
  )

  const handlePlayTrack = () => {
    setIsActive(true)
    spotifyClient.play({
      device_id: device?.device_id,
      context_uri: playlist?.uri,
      offset: {
        position: index,
      },
    })
    setCurrentTrackInfo({
      playlistId: playlist.id,
      currentTrackIndex: index,
    })
  }

  const renderPlayButtonOrIndex = useCallback(() => {
    const PlayPauseIcon = playbackState?.paused ? Play : Pause
    if (isActive)
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            player?.togglePlay()
          }}
          className="hover:bg-muted p-1 rounded-full"
        >
          <PlayPauseIcon className="h-4 w-4" />
        </button>
      )

    if (isHovered) return <Play className="h-4 w-4 text-muted-foreground" />
    return <p className="text-muted-foreground w-4">{index + 1}.</p>
  }, [isActive, index, isHovered])

  return (
    <Box
      onClickOutside={(e, currentEl) => {
        if (currentEl?.contains(e.target as Node)) return
        const target = e.target as HTMLElement
        if (target.closest('[data-type="track-item"]')) {
          setIsActive(false)
        }
      }}
      data-type="track-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayTrack}
      className={cn(
        'flex items-center gap-4 hover:bg-foreground/5 px-4 py-2 rounded-sm cursor-pointer',
        { 'bg-primary/10': isActive }
      )}
    >
      {renderPlayButtonOrIndex()}
      <div className="flex gap-2 items-center">
        <img src={imageUrl} className="h-8 w-8 rounded-[4px]" />
        <div className="flex flex-col">
          <p className="text-sm font-medium flex gap-1 items-center">
            {track.name}
            {isActive && (
              <AnimatedPlayIcon
                className="ml-2"
                paused={playbackState?.paused}
                barProps={{
                  className: 'bg-primary',
                }}
              />
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {artistName} • {trackDuration}
          </p>
        </div>
      </div>
    </Box>
  )
}
