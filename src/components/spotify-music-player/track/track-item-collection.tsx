import { useEffect, useState } from 'react'
import { TrackItem } from './track-item'
import { Virtuoso } from 'react-virtuoso'
import { ScrollAreaRoot, ScrollAreaViewport } from '@/components/ui/scroll-area'
import { usePlayerContext } from '@/atoms/atoms'
import { useTrackListQuery } from '@/react-query/queries/use-tracklist.query'
import {
  usePlaybackState,
  usePlayerDevice,
} from 'react-spotify-web-playback-sdk'
import { usePlayTrack } from '@/react-query/mutations/play-track.mutation'
import useOptimistic from '@/hooks/use-optimistic.hook'
import { getTrackKey } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock } from 'lucide-react'

type TrackItemCollectionProps = {
  playlist: SpotifyApi.SinglePlaylistResponse
  onScrolled: (startIndex: number) => void
}

export const TrackItemCollection = ({
  playlist,
  onScrolled,
}: TrackItemCollectionProps) => {
  const device = usePlayerDevice()
  const playbackState = usePlaybackState()
  const [playerContext, setPlayerContext] = usePlayerContext()
  const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null)
  const [trackList, setTrackList] = useState<SpotifyApi.PlaylistTrackObject[]>(
    playlist.tracks.items
  )
  const {
    data: tracks,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
  } = useTrackListQuery(playlist.id)

  const { mutate: loadPlayer } = usePlayTrack()

  useEffect(() => {
    refetch()
  }, [playlist.id])

  useEffect(() => {
    const playlistTracks = playlist.tracks.items
    const tracklistTracks = tracks?.pages.map((page) => page.items).flat() || []
    setTrackList([...playlistTracks, ...tracklistTracks])
  }, [tracks])

  const handlePlayTrack = async (trackKey: string) => {
    if (!device?.device_id) return
    const trackIdx = trackList.findIndex(
      (track) =>
        getTrackKey(track.track as SpotifyApi.TrackObjectFull) === trackKey
    )
    setPlayerContext({
      ...playerContext,
      playlistId: playlist.id,
      uri: playlist.uri,
      trackIdx,
    })
    return loadPlayer({
      device_id: device.device_id,
      context_uri: playlist.uri,
      offset: {
        position: trackIdx,
      },
    })
  }
  const [activeTrackKey, setActiveTrackKey, setActiveTrackKeyDirect] =
    useOptimistic<string>(
      getTrackKey(
        playbackState?.track_window
          .current_track as unknown as SpotifyApi.TrackObjectFull
      ),
      handlePlayTrack
    )
  useEffect(() => {
    const activeTrackKey = getTrackKey(
      playbackState?.track_window
        .current_track as unknown as SpotifyApi.TrackObjectFull
    )
    setActiveTrackKeyDirect(activeTrackKey)
  }, [playbackState?.track_window])

  return (
    <div className="flex h-full w-full flex-col gap-1 pb-10">
      <div className="flex items-center justify-between gap-2 px-4 pb-2">
        <div className="flex flex-[3] gap-5">
          <p className="text-xs text-muted-foreground">#</p>
          <p className="text-xs text-muted-foreground">Title</p>
        </div>
        <div className="flex flex-[2] justify-between gap-4">
          <p className="px-1 text-xs text-muted-foreground">Album</p>
          <Clock className="mr-6 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <ScrollAreaRoot className="no-scrollbar h-full overflow-y-auto pr-4">
        <ScrollAreaViewport className="no-scrollbar" ref={setScrollParent}>
          <Virtuoso
            rangeChanged={({ startIndex }) => onScrolled(startIndex)}
            data={trackList}
            className="!h-0"
            customScrollParent={scrollParent ?? undefined}
            endReached={() => {
              if (trackList.length === playlist.tracks.total) return
              fetchNextPage()
            }}
            itemContent={(i, track) => {
              const trackKey = getTrackKey(
                track.track as SpotifyApi.TrackObjectFull
              )
              const isActive = activeTrackKey === trackKey
              return (
                <TrackItem
                  onClick={() => setActiveTrackKey(trackKey)}
                  isActive={isActive}
                  index={i}
                  track={track.track as SpotifyApi.TrackObjectFull}
                />
              )
            }}
            components={{
              Footer: () => isFetchingNextPage && <LoadingNewTracks />,
            }}
          />
        </ScrollAreaViewport>
      </ScrollAreaRoot>
    </div>
  )
}

const LoadingNewTracks = () => (
  <div className="my-2 ml-4 flex items-center gap-1">
    <Skeleton className="h-4 w-7 rounded-sm bg-sub" />
    <Skeleton className="flex h-9 w-9 items-center gap-2 bg-sub px-2" />
    <div>
      <Skeleton className="mb-1 h-4 w-20 rounded-sm bg-sub" />
      <Skeleton className="h-3 w-[10rem] rounded-sm bg-sub" />
    </div>
  </div>
)
