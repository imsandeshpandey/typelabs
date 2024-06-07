import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useUserQuery } from '../react-query/queries/current-user.query'
import { useAuthorizationQuery } from '../react-query/mutations/authorization.mutation'

const params = new URLSearchParams(window.location.search)
const code = params.get('code')

type SpotifyAuthContextState = {
  accessToken: string
  expiresIn: number
  user: {
    data: SpotifyApi.CurrentUsersProfileResponse | undefined
    isLoading: boolean
  }
}

const initialState = {
  accessToken: '',
  expiresIn: 0,
  user: {
    data: undefined,
    isLoading: true,
  },
}

const spotifyAuthContext = createContext<SpotifyAuthContextState>(initialState)

export const SpotifyAuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState('')
  const [expiresIn, setExpiresIn] = useState(0)
  const { data: user, refetch: refetchUser, isLoading } = useUserQuery()

  const { mutate: authorize } = useAuthorizationQuery({
    onSuccess: (data): void => {
      setAccessToken(data.accessToken)
      setExpiresIn(data.expiresIn)
      console.log('authorize')
    },
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      window.history.replaceState({}, '', '/')
    },
  })

  useEffect(() => {
    if (user) refetchUser()
  }, [accessToken])

  useEffect(() => {
    const delay = (expiresIn - 600) * 1000 // 10 minute before expiration
    if (accessToken) {
      const timeout = setTimeout(() => authorize(code), delay)
      return () => clearTimeout(timeout)
    }
  }, [accessToken])

  useEffect(() => {
    authorize(code)
  }, [])

  return (
    <spotifyAuthContext.Provider
      value={{
        accessToken,
        expiresIn,
        user: {
          data: user,
          isLoading,
        },
      }}
    >
      {children}
    </spotifyAuthContext.Provider>
  )
}

export const useSpotifyAuth = () => useContext(spotifyAuthContext)
