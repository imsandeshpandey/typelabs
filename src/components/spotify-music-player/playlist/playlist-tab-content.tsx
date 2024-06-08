import { Button } from '../../ui/button'
import { AlertTriangle, ListMusic } from 'lucide-react'
import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { useEffect } from 'react'
import { PlayIcon } from '@radix-ui/react-icons'
import { PlaylistTabContentSkeleton } from './playlist-tab-content.skeleton'
import { TrackItemCollection } from '../track/track-item-collection'
import { useCurrentTrackInfo, useTrackList } from '@/state/atoms'
import { usePlaylist } from '../../../react-query/queries/playlist.query'
import React from 'react'

export const PlaylistTabContent = ({
  activePlaylist,
}: {
  activePlaylist: string
}) => {
  const [currentTrackInfo, setCurrentTrackInfo] = useCurrentTrackInfo()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTrackList] = useTrackList()
  const {
    data: playlist,
    refetch,
    error,
    isLoading,
  } = usePlaylist(activePlaylist)

  useEffect(() => {
    refetch()
  }, [activePlaylist])

  useEffect(() => {
    if (playlist?.id === currentTrackInfo.playlistId) {
      setTrackList(playlist?.tracks?.items || [])
    }
  }, [currentTrackInfo, playlist])

  const handlePlaylistPlay = () => {
    const tracklist = playlist?.tracks?.items || []
    setTrackList(tracklist)
    setCurrentTrackInfo({
      playlistId: playlist?.id || '',
      currentTrackIndex: 0,
    })
  }

  if (isLoading && activePlaylist) return <PlaylistTabContentSkeleton />

  if (!activePlaylist) {
    return (
      <h2 className="m-auto font-bold text-xl flex gap-2 items-center">
        <ListMusic className="h-10 w-10" />
        No playlist selected
      </h2>
    )
  }
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
        className="relative overflow-hidden w-full h-[13rem] min-w-[22rem] bg-cover bg-center flex items-end px-4 py-2 "
      >
        <div className="flex gap-2">
          <div>
            <h2 className="text-xl font-bold">{playlist?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {playlist?.owner?.display_name} • {playlist?.tracks?.total} tracks
            </p>
          </div>
          <Button
            onClick={handlePlaylistPlay}
            size="icon"
            className="rounded-full "
          >
            <PlayIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <TrackItemCollection playlist={playlist!} />
    </div>
  )
}
