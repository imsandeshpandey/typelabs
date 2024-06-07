import { useQuery } from '@tanstack/react-query'
import { spotifyClient } from '@/config/spotify-client.config'
import { QUERY_CURRENT_USER } from '../../config/react-query.config'

export const useUserQuery = () =>
  useQuery({
    queryKey: [QUERY_CURRENT_USER],
    queryFn: spotifyClient.getMe,
  })
