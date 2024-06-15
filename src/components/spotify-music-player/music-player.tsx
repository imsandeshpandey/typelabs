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
      <div className="w-[10rem] text-sm flex gap-2 text-muted-foreground h-12 rounded-md">
        <Skeleton className="h-12 w-12 bg-background/20 rounded-sm" />
        <div>
          <Skeleton className="h-3 w-24 mb-1 bg-black/20 rounded-sm" />
          <Skeleton className="h-3 w-20 bg-black/20 rounded-sm" />
        </div>
      </div>
    )
  }

  if (!playerContext.uri && !currentTrack) {
    return (
      <div className="h-12 text-sm w-fit font-semibold cursor-pointer hover:bg-background/20 rounded-md px-4 gap-2 flex items-center">
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
          'absolute hover:shadow-md overflow-y-visible cursor-pointer group -translate-y-full whitespace-nowrap hover:h-20 h-12 transition-all flex gap-4 items-center rounded-0 hover:rounded-md hover:bg-foreground/5 dark:hover:bg-background/20 px-0 hover:px-4 py-0 hover:py-4',
          className
        )}
        {...props}
      >
        {/*Progress Bar when not hovered */}
        <img
          src={currentTrack?.album.images[0].url || spotifyLogo}
          alt="spotify"
          className="transition-all z-10 group-hover:h-14 h-10 shadow-md group-hover:rounded-none"
        />
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
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
            <div className="transition-all gap-1 origin-left scale-0 group-hover:scale-100 -ml-20 group-hover:ml-0 items-center flex">
              <Tooltip>
                <TooltipTrigger>
                  <TrackButton
                    disabled={isPrevPending}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreviousTrack()
                    }}
                  >
                    {isPrevPending && (
                      <Loader2 className="animate-spin h-4 w-4" />
                    )}
                    {!isPrevPending && <SkipBack className="h-4 w-4 " />}
                  </TrackButton>
                </TooltipTrigger>
                <TooltipContent className="border-foreground/20 text-xs">
                  {KEYBINDS.PREVIOUS_TRACK.label}
                </TooltipContent>
              </Tooltip>
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
              <Tooltip>
                <TooltipTrigger>
                  <TrackButton
                    disabled={isNextPending}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNextTrack()
                    }}
                  >
                    {isNextPending && (
                      <Loader2 className="animate-spin h-4 w-4" />
                    )}
                    {!isNextPending && <SkipForward className="h-4 w-4 " />}
                  </TrackButton>
                </TooltipTrigger>
                <TooltipContent className="border-foreground/20 text-xs">
                  {KEYBINDS.NEXT_TRACK.label}
                </TooltipContent>
              </Tooltip>
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
      <div className="absolute h-0.5 w-full -bottom-1 left-0 dark:bg-background/20 bg-foreground/10 group-hover:scale-0 scale-100 transition-all">
        <div
          className="h-full bg-primary"
          style={{
            width: positionPercentage + '%',
          }}
        />
      </div>
      <div
        className="gap-2 transition-all origin-bottom-left scale-0 group-hover:scale-100 flex"
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
      className={cn(
        'rounded-full p-0 hover:bg-foreground/10 transition-colors',
        className
      )}
      {...props}
    />
  )
}
