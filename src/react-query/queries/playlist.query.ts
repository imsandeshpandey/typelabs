import { useQuery } from '@tanstack/react-query'
import { spotifyClient } from '@/config/spotify-client.config'
import { QUERY_PLAYLIST } from '../../config/react-query.config'

export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: [QUERY_PLAYLIST, playlistId],
    queryFn: () => spotifyClient.getPlaylist(playlistId),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: true,
  })
}
