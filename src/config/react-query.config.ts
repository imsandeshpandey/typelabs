import { QueryClient } from '@tanstack/react-query'

export const QUERY_CURRENT_USER = 'currentUser'
export const QUERY_MY_PLAYLISTS = 'myPlaylists'
export const QUERY_PLAYLIST = 'playlist'
export const QUERY_TRACKLIST = 'tracklist'

export const queryClient = new QueryClient()
