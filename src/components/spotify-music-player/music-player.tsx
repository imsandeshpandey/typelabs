import spotifyLogo from '@/assets/images/default-playlist.png'
import { cn, generateFontCss, sf_ms } from '@/lib/utils'
import { FC, HTMLAttributes, useEffect, useState } from 'react'
import { Slider } from '../ui/slider'
import { Button, ButtonProps } from '../ui/button'
import {
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
import { usePlayerContext } from '@/atoms/atoms'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlayTrack } from '@/react-query/mutations/play-track.mutation'
import { useSpotifyAuth } from '@/providers/spotify-auth.provider'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { KEYBINDS } from '@/config/keybinds.config'
import { spotifyClient } from '@/config/spotify-client.config'
import { useMutation } from '@tanstack/react-query'

export type MusicPlayerProps = HTMLAttributes<HTMLDivElement>

const DEFAULT_PLAYBACK_STATE = {
  duration: 1000,
  position: 0,
  paused: false,
  track_window: {
    current_track: null,
    previous_tracks: [],
    next_tracks: [],
  },
}

const DEFAULT_DEVICE_STATE = {
  device_id: '',
  status: 'not-ready',
}

export const MusicPlayer: FC<MusicPlayerProps> = ({ className, ...props }) => {
  const { user } = useSpotifyAuth()
  const player = useSpotifyPlayer()
  const { device_id: deviceId, status: deviceStatus } =
    usePlayerDevice() || DEFAULT_DEVICE_STATE
  const {
    paused,
    track_window: { current_track: currentTrack },
  } = usePlaybackState() || DEFAULT_PLAYBACK_STATE

  const [playerContext] = usePlayerContext()
  const { mutate: loadPlayer, isPending: isPlayerLoading } = usePlayTrack()

  useEffect(() => {
    player?.setName(`${user.data?.display_name}'s typelabs`)
  }, [user])

  useEffect(() => {
    if (deviceId && playerContext) {
      loadPlayer({
        device_id: deviceId,
        context_uri: playerContext.uri,
        offset: {
          position: playerContext.trackIdx,
        },
      })
    }
  }, [deviceId])

  const { mutate: handleNextTrack, isPending: isNextPending } = useMutation({
    mutationFn: () => spotifyClient.skipToNext(),
    mutationKey: ['nextTrack'],
  })
  const { mutate: handlePreviousTrack, isPending: isPrevPending } = useMutation(
    {
      mutationFn: () => spotifyClient.skipToPrevious(),
      mutationKey: ['previousTrack'],
    }
  )

  useHotkeys(KEYBINDS.TOGGLE_PLAY.hotkey, () => player?.togglePlay())
  useHotkeys(KEYBINDS.NEXT_TRACK.hotkey, () => handleNextTrack(), {
    ignoreEventWhen: () => isPrevPending || isNextPending,
  })
  useHotkeys(KEYBINDS.PREVIOUS_TRACK.hotkey, () => handlePreviousTrack(), {
    ignoreEventWhen: () => isPrevPending || isNextPending,
  })

  const PlaypauseIcon = paused ? Play : Pause

  if (deviceStatus !== 'ready' || isPlayerLoading) {
    return (
      <div className="flex h-12 w-[10rem] gap-2 rounded-md text-sm text-muted-foreground">
        <Skeleton className="h-12 w-12 rounded-sm bg-black/20" />
        <div>
          <Skeleton className="mb-1 h-3 w-24 rounded-sm bg-black/20" />
          <Skeleton className="h-3 w-20 rounded-sm bg-black/20" />
        </div>
      </div>
    )
  }

  if (!playerContext.uri && !currentTrack) {
    return (
      <div className="flex h-12 w-fit cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-semibold hover:bg-background/20">
        <ListMusic className="h-6 w-6 text-primary" />
        Choose Playlist
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
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
          'rounded-0 group absolute flex h-12 -translate-y-full cursor-pointer items-center gap-4 overflow-y-visible whitespace-nowrap px-0 py-0 transition-all hover:h-20 hover:rounded-md hover:bg-foreground/5 hover:px-4 hover:py-4 hover:shadow-md dark:hover:bg-background/20',
          className
        )}
        {...props}
      >
        {/*Progress Bar when not hovered */}
        <img
          src={currentTrack?.album.images[0].url || spotifyLogo}
          alt="spotify"
          className="z-10 h-10 shadow-md transition-all group-hover:h-14 group-hover:rounded-none"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <div>
              <Tooltip>
                <TooltipTrigger>
                  <h2 className="max-w-[12rem] overflow-hidden text-ellipsis text-sm font-medium">
                    {currentTrack?.name}
                  </h2>
                </TooltipTrigger>
                <TooltipContent className="text-xs hover:underline">
                  {currentTrack?.name}
                </TooltipContent>
              </Tooltip>
              <p className="-mb-2 text-xs text-muted-foreground transition-all group-hover:mb-2">
                {currentTrack?.artists[0].name}
              </p>
            </div>
            <div className="-ml-20 flex origin-left scale-0 items-center gap-1 transition-all group-hover:ml-0 group-hover:scale-100">
              <TrackButton
                disabled={isPrevPending}
                tooltipContent={KEYBINDS.PREVIOUS_TRACK.label}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreviousTrack()
                }}
              >
                {isPrevPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {!isPrevPending && <SkipBack className="h-4 w-4" />}
              </TrackButton>

              <TrackButton
                tooltipContent={KEYBINDS.TOGGLE_PLAY.label}
                onClick={(e) => {
                  e.stopPropagation()
                  player?.togglePlay()
                }}
              >
                <PlaypauseIcon className="h-4 w-4" />
              </TrackButton>
              <TrackButton
                disabled={isNextPending}
                tooltipContent={KEYBINDS.NEXT_TRACK.label}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextTrack()
                }}
              >
                {isNextPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {!isNextPending && <SkipForward className="h-4 w-4" />}
              </TrackButton>
            </div>
          </div>
          <TrackProgressBar />
        </div>
      </div>
    </div>
  )
}

type TrackProgressBarProps = HTMLAttributes<HTMLDivElement>

const TrackProgressBar = (props: TrackProgressBarProps) => {
  const player = useSpotifyPlayer()
  const { duration, position, paused } =
    usePlaybackState(true, 100) || DEFAULT_PLAYBACK_STATE

  // SEEK
  const [positionLocal, setPositionLocal] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [lastPaused, setLastPaused] = useState(false)

  const handleSeek = (val: number[]) => {
    if (!isSeeking) setIsSeeking(true)
    if (!paused) player?.pause()
    setLastPaused(paused)

    const newVal = val[0]
    setPositionLocal(newVal)
  }
  const confirmSeek = () => {
    const position = (positionLocal * duration) / 100
    setTimeout(() => setIsSeeking(false), 200)
    if (!lastPaused) player?.resume()
    player?.seek(position)
  }

  const positionPercentage = (position * 100) / duration
  const positionLocalMs = (positionLocal / 100) * duration
  const positionFormatted = sf_ms(isSeeking ? positionLocalMs : position)
  const durationFormatted = sf_ms(duration)
  return (
    <>
      <div className="absolute -bottom-1 left-0 h-0.5 w-full scale-100 bg-foreground/10 transition-all group-hover:scale-0 dark:bg-background/20">
        <div
          className="h-full bg-primary"
          style={{
            width: positionPercentage + '%',
          }}
        />
      </div>
      <div
        className="flex origin-bottom-left scale-0 gap-2 transition-all group-hover:scale-100"
        {...props}
      >
        <p className="text-xs text-muted-foreground">{positionFormatted}</p>
        <Slider
          onClick={(e) => {
            e.stopPropagation()
          }}
          value={[isSeeking ? positionLocal : positionPercentage]}
          onValueChange={handleSeek}
          onValueCommit={confirmSeek}
          className="w-full flex-1"
          trackClassName="bg-foreground/10 h-1.5"
          thumbClassName="h-4 w-4"
        />
        <p className="text-xs text-muted-foreground">{durationFormatted}</p>
      </div>
    </>
  )
}

const TrackButton = ({ className, ...props }: ButtonProps) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      tooltipContentProps={{ className: 'text-xs' }}
      className={cn(
        'rounded-full p-0 transition-colors hover:bg-foreground/10',
        className
      )}
      {...props}
    />
  )
}
