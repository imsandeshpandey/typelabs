import { useMutation } from '@tanstack/react-query'
import { spotifyClient } from '@/config/spotify-client.config'

export const usePlayTrack = () =>
  useMutation({
    mutationFn: async ({ id, track }: { id: string; track: string }) =>
      spotifyClient.play({
        device_id: id,
        uris: [track],
      }),
    mutationKey: ['play-track'],
  })
