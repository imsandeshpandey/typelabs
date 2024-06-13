import React from 'react'
import spotifyLogo from '@/assets/images/default-playlist.png'
import { cn, generateFontCss } from '@/lib/utils'
import { FC, HTMLAttributes, useEffect, useState } from 'react'
import { Slider } from '../ui/slider'
import { Button, ButtonProps } from '../ui/button'
import {
  AlertCircle,
  ChevronUp,
  ListMusic,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import {
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
} from 'react-spotify-web-playback-sdk'
import {
  useCurrentTrackInfo,
  useTrackList,
  useTrackUriList,
} from '@/atoms/atoms'
import sf from 'seconds-formater'
import { Skeleton } from '../ui/skeleton'
import { usePlayTrack } from '../../react-query/mutations/play-track.mutation'
import { useSpotifyAuth } from '@/providers/spotify-auth.provider'
import { useHotkeys } from 'react-hotkeys-hook'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { KEYBINDS } from '@/config/keybinds.config'
import { spotifyClient } from '@/config/spotify-client.config'
import { useMutation } from '@tanstack/react-query'

export type MusicPlayerProps = HTMLAttributes<HTMLDivElement>

export const MusicPlayer: FC<MusicPlayerProps> = ({ className, ...props }) => {
  const player = useSpotifyPlayer()
  const playbackState = usePlaybackState(true, 100)
  const [trackList] = useTrackList()
  const [trackUriList] = useTrackUriList()
  const { user } = useSpotifyAuth()
  const device = usePlayerDevice()

  const [currentTrackInfo, setCurrentTrackInfo] = useCurrentTrackInfo()
  const [lastPaused, setLastPaused] = useState(false)
  const { mutate: loadPlayer, error: playTrackError } = usePlayTrack()

  const { duration, position, paused } = playbackState || {
    duration: 1000,
    position: 0,
    paused: true,
  }

  const PlaypauseIcon = paused ? Play : Pause
  const positionPercentage = (position * 100) / duration
  const positionFormatted = sf.convert(position / 1000).format('MM:SS')
  const durationFormatted = sf.convert(duration / 1000).format('MM:SS')

  const currentTrackLocal = trackList[currentTrackInfo.currentTrackIndex]
    ?.track as SpotifyApi.TrackObjectFull

  const currentTrack =
    currentTrackLocal || playbackState?.track_window?.current_track

  useHotkeys(KEYBINDS.TOGGLE_PLAY.hotkey, () => player?.togglePlay())

  const { mutate: handleNext, isPending: isNextLoading } = useMutation({
    mutationKey: ['next-track'],
    mutationFn: () => spotifyClient.skipToNext(),
    onSuccess: () => {
      setCurrentTrackInfo({
        playlistId: currentTrackInfo.playlistId,
        currentTrackIndex: currentTrackInfo.currentTrackIndex + 1,
      })
    },
  })
  const { mutate: handlePrevious, isPending: isPreviousLoading } = useMutation({
    mutationKey: ['previous-track'],
    mutationFn: () => spotifyClient.skipToPrevious(),
    onSuccess: () => {
      setCurrentTrackInfo({
        playlistId: currentTrackInfo.playlistId,
        currentTrackIndex: currentTrackInfo.currentTrackIndex - 1,
      })
    },
  })

  useEffect(() => {
    player?.setName(`${user.data?.display_name}'s typelabs`)
  }, [user])

  useEffect(() => {
    if (!device?.device_id || trackUriList.length === 0) return
    loadPlayer({
      deviceId: device.device_id,
      playlistId: currentTrackInfo.playlistId,
      trackIndex: currentTrackInfo.currentTrackIndex,
    })
  }, [
    device?.device_id,
    currentTrackInfo.playlistId,
    currentTrackInfo.currentTrackIndex,
  ])

  const handleSeek = (val: number[]) => {
    if (!paused) player?.pause()

    const newVal = val[0] >= 100 ? 99.9 : val[0]
    const position = (newVal * duration) / 100
    player?.seek(position)
  }

  if (device?.status !== 'ready') {
    return (
      <div className="w-[10rem] text-sm flex gap-2 text-muted-foreground h-12 rounded-md">
        <Skeleton className="h-12 w-12 bg-background/20 rounded-sm" />
        <div>
          <Skeleton className="h-3 w-24 mb-1 bg-background/20 rounded-sm" />
          <Skeleton className="h-3 w-20 bg-background/20 rounded-sm" />
        </div>
      </div>
    )
  }

  if (
    !currentTrackInfo.playlistId &&
    !playbackState?.track_window?.current_track
  ) {
    return (
      <div className="h-12 text-sm w-fit font-semibold cursor-pointer hover:bg-background/20 rounded-md px-4 gap-2 flex items-center">
        <ListMusic className="h-6 w-6 text-primary" />
        Choose Playlist
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  }
  if (playTrackError) {
    return (
      <div className="h-12 text-xs w-fit font-semibold cursor-pointer hover:bg-background/20 rounded-md px-4 gap-2 flex items-center">
        <AlertCircle className="h-4 w-4 text-rose-500" />
        Spotify Not Responding
      </div>
    )
  }
  return (
    <div className="relative w-full">
      <div
        style={{
          fontFamily: generateFontCss('Poppins'),
        }}
        className={cn(
          'absolute hover:shadow-md overflow-x-clip overflow-y-visible cursor-pointer group -translate-y-full whitespace-nowrap hover:h-20 h-12 transition-all flex gap-4 items-center rounded-0 hover:rounded-md hover:bg-foreground/5 dark:hover:bg-background/20 px-0 hover:px-4 py-0 hover:py-4',
          className
        )}
        {...props}
      >
        {/*Progress Bar when not hovered */}
        <div className="absolute h-0.5 w-full -bottom-1 left-0 dark:bg-background/20 bg-foreground/10 group-hover:scale-0 scale-100 transition-all">
          <div
            className="h-full bg-primary"
            style={{
              width: positionPercentage,
            }}
          />
        </div>
        <img
          src={currentTrack?.album.images[0].url || spotifyLogo}
          alt="spotify"
          className="transition-all z-10 group-hover:h-14 h-10 shadow-md group-hover:rounded-none"
        />
        <div className="flex flex-col">
          <div className="flex  gap-4 items-center">
            <div>
              <Tooltip>
                <TooltipTrigger>
                  <h2 className="text-sm font-medium max-w-[12rem] text-ellipsis overflow-hidden">
                    {currentTrack?.name}
                  </h2>
                </TooltipTrigger>
                <TooltipContent className=" text-xs">
                  {currentTrack?.name}
                </TooltipContent>
              </Tooltip>
              <p className="text-xs text-muted-foreground -mb-2 group-hover:mb-2 transition-all">
                {currentTrack?.artists[0].name}
              </p>
            </div>
            <div className="transition-all gap-1 origin-left scale-0 group-hover:scale-100 items-center flex">
              <TrackButton
                disabled={isPreviousLoading}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
              >
                {isPreviousLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {!isPreviousLoading && <SkipBack className="h-4 w-4 " />}
              </TrackButton>
              <Tooltip>
                <TooltipTrigger>
                  <TrackButton
                    onClick={(e) => {
                      e.stopPropagation()
                      player?.togglePlay()
                    }}
                  >
                    <PlaypauseIcon className="h-4 w-4 " />
                  </TrackButton>
                </TooltipTrigger>
                <TooltipContent className="border-foreground/20 text-xs">
                  {KEYBINDS.TOGGLE_PLAY.label}
                </TooltipContent>
              </Tooltip>
              <TrackButton
                disabled={isNextLoading}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
              >
                {isNextLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {!isNextLoading && <SkipForward className="h-4 w-4 " />}
              </TrackButton>
            </div>
          </div>
          <div className="gap-2 transition-all origin-bottom-left scale-0 group-hover:scale-100 flex">
            <p className="text-xs text-muted-foreground">{positionFormatted}</p>
            <Slider
              onClick={(e) => {
                e.stopPropagation()
              }}
              onMouseEnter={() => setLastPaused(!!playbackState?.paused)}
              onMouseLeave={() => {
                !lastPaused && player?.resume()
              }}
              value={[positionPercentage]}
              onValueChange={handleSeek}
              className="w-full flex-1"
              trackClassName="bg-foreground/10 h-1.5"
              thumbClassName="h-4 w-4"
            />
            <p className="text-xs text-muted-foreground">{durationFormatted}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const TrackButton = ({ className, ...props }: ButtonProps) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        'rounded-full p-0 hover:bg-foreground/10 transition-colors',
        className
      )}
      {...props}
    />
  )
}
