import { useEffect, useRef, useState } from 'react'
import { TrackItem } from './track-item'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { ScrollAreaRoot, ScrollAreaViewport } from '@/components/ui/scroll-area'
import { usePlayerContext } from '@/atoms/atoms'
import { useTrackListQuery } from '@/react-query/queries/use-tracklist.query'
import { Loader2 } from 'lucide-react'
import {
  usePlaybackState,
  usePlayerDevice,
} from 'react-spotify-web-playback-sdk'
import { usePlayTrack } from '@/react-query/mutations/play-track.mutation'
import useOptimistic from '@/hooks/use-optimistic.hook'
import { getTrackKey } from '@/lib/utils'

type TrackItemCollectionProps = {
  playlist: SpotifyApi.SinglePlaylistResponse
}

export const TrackItemCollection = ({ playlist }: TrackItemCollectionProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
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

  const LoadingFooter = () =>
    !!isFetchingNextPage && (
      <div className="flex gap-3 text-muted-foreground items-center px-4 py-2">
        <Loader2 className="animate-spin h-5 w-5" />
        Loading Tracks
      </div>
    )

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
  const [activeTrackKey, setActiveTrackKey] = useOptimistic<string>(
    getTrackKey(
      playbackState?.track_window
        .current_track as unknown as SpotifyApi.TrackObjectFull
    ),
    handlePlayTrack
  )
  console.log('activeTrackIdx', activeTrackKey)
  return (
    <div className="flex h-full flex-col w-full pb-10 gap-1">
      <ScrollAreaRoot className="h-full overflow-y-auto pr-4">
        <ScrollAreaViewport ref={setScrollParent}>
          <Virtuoso
            initialTopMostItemIndex={
              playerContext.playlistId === playlist.id
                ? playerContext.trackIdx
                : 0
            }
            ref={virtuosoRef}
            data={trackList}
            increaseViewportBy={200}
            className="!h-10"
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
              Footer: LoadingFooter,
            }}
          />
        </ScrollAreaViewport>
      </ScrollAreaRoot>
    </div>
  )
}
