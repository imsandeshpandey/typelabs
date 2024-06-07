import { useQuery } from '@tanstack/react-query'
import { spotifyClient } from '@/config/spotify-client.config'
import { QUERY_MY_PLAYLISTS } from '../../config/react-query.config'

export const useMyPlaylists = () => {
  return useQuery({
    queryKey: [QUERY_MY_PLAYLISTS],
    queryFn: async () => {
      const playlists = await spotifyClient.getUserPlaylists()
      return playlists
    },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: 60 * 60 * 1000,
    retry: true,
  })
}
