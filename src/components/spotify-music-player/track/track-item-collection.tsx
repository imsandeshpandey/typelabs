import { useRef, useState } from 'react'
import { TrackItem } from './track-item'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { useCurrentTrackInfo } from '@/state/atoms'
import { ScrollAreaRoot, ScrollAreaViewport } from '@/components/ui/scroll-area'

export const TrackItemCollection = ({
  playlist,
}: {
  playlist: SpotifyApi.SinglePlaylistResponse
}) => {
  const trackList = playlist?.tracks?.items
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [currentTrackInfo] = useCurrentTrackInfo()
  const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null)

  return (
    <div className="flex h-full flex-col w-full pb-10 gap-1">
      <ScrollAreaRoot className="h-full overflow-y-auto pr-4">
        <ScrollAreaViewport ref={setScrollParent}>
          <Virtuoso
            initialTopMostItemIndex={
              currentTrackInfo.playlistId === playlist.id
                ? currentTrackInfo.currentTrackIndex
                : 0
            }
            ref={virtuosoRef}
            data={trackList}
            className="!h-10"
            customScrollParent={scrollParent ?? undefined}
            itemContent={(i, track) => (
              <TrackItem
                index={i}
                track={track.track as SpotifyApi.TrackObjectFull}
                playlist={playlist}
              />
            )}
          />
        </ScrollAreaViewport>
      </ScrollAreaRoot>
    </div>
  )
}
