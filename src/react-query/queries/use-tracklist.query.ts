import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_TRACKLIST } from '../../config/react-query.config'
import { spotifyClient } from '@/config/spotify-client.config'

const fetchTrackList = async (pageParam: number, playlistId: string) => {
  if (pageParam === 0) {
    return {
      items: [],
      next: 1,
    }
  }
  const offset = pageParam * 100
  const res = await spotifyClient.getPlaylistTracks(playlistId, {
    limit: 100,
    offset,
  })
  return {
    items: res.items,
    next: pageParam + 1,
  }
}

export const useTrackListQuery = (playlistId: string) =>
  useInfiniteQuery({
    queryKey: [QUERY_TRACKLIST, playlistId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchTrackList(pageParam, playlistId),
    getNextPageParam: (lastPage) => lastPage.next,
  })
