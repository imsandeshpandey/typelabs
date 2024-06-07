import { useMutation } from '@tanstack/react-query'
import { axios } from '@/config/axios.config'
import { spotifyClient } from '@/config/spotify-client.config'

export type AuthorizationResponse = {
  accessToken: string
  expiresIn: number
  superAccessToken: string
}

export const useAuthorizationQuery = (props: {
  onSuccess?: (data: AuthorizationResponse) => void
  onError?: (err: Error) => void
  onSettled?: () => void
}) =>
  useMutation({
    mutationFn: async (code: string | null = null) => {
      const res = await axios.post(
        `/authorize`,
        { code },
        { withCredentials: true }
      )
      const data = res.data
      const { accessToken, expiresIn, superAccessToken } = data
      spotifyClient.setAccessToken(accessToken)
      return { accessToken, superAccessToken, expiresIn }
    },

    ...props,
  })
