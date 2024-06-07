import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { cn } from '@/lib/utils'
import { Pause, Play } from 'lucide-react'
import {
  usePlaybackState,
  useSpotifyPlayer,
} from 'react-spotify-web-playback-sdk'
import sf from 'seconds-formater'
import { useCurrentTrackInfo, useTrackList } from '@/state/atoms'
import { FC, useCallback, useMemo, useState } from 'react'
import { AnimatedPlayIcon } from '@/components/compound-ui/animated-play-icon'

export type TrackItemProps = {
  track: SpotifyApi.TrackObjectFull
  index: number
  playlist: SpotifyApi.PlaylistObjectFull
}

export const TrackItem: FC<TrackItemProps> = ({ track, index, playlist }) => {
  const playbackState = usePlaybackState(true, 100)
  const player = useSpotifyPlayer()
  const [currentTrackInfo, setCurrentTrackInfo] = useCurrentTrackInfo()
  const [trackList, setTrackList] = useTrackList()
  const [isHovered, setIsHovered] = useState(false)

  const artistName = track.artists?.[0]?.name
  const imageUrl = track.album.images?.[1]?.url || defaultPlaylistIcon
  const currentTrack = trackList[currentTrackInfo.currentTrackIndex]

  const trackDuration = useMemo(
    () => sf.convert(track.duration_ms / 1000).format(),
    [track.duration_ms]
  )

  const isActive =
    track.id === currentTrack?.track.id &&
    currentTrackInfo.playlistId === playlist.id

  const handlePlayTrack = () => {
    const newTrackList = playlist?.tracks?.items || []
    setTrackList(newTrackList)
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
    <div
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
    </div>
  )
}
