import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { ScrollArea } from '../ui/scroll-area'
import { PlaylistTabContent } from './playlist/playlist-tab-content'
import { PlaylistTab } from './playlist/playlist-tab'
import { DrawerSkeleton } from './spotify-drawer.skeleton'
import { generateFontCss } from '@/lib/utils'
import { MusicPlayer } from './music-player'
import { usePlayerContext, useTrackList } from '@/atoms/atoms'
import { useEffect, useState } from 'react'
import { useMyPlaylists } from '../../react-query/queries/my-playlists.query'
import { usePlaylist } from '@/react-query/queries/playlist.query'
import { PlaylistTabContentSkeleton } from './playlist/playlist-tab-content.skeleton'
import { AlertCircle, ListMusic, LogOutIcon, User2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useSpotifyAuth } from '@/providers/spotify-auth.provider'
import { Button } from '../ui/button'
import { useLogout } from '@/react-query/mutations/logout.mutation'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export const SpotifyDrawer = () => {
  const [, setTrackList] = useTrackList()
  const [playerContext] = usePlayerContext()
  const { data: currentPlaylist, refetch } = usePlaylist(
    playerContext.playlistId
  )

  useEffect(() => {
    refetch()
  }, [playerContext.playlistId])

  useEffect(() => {
    setTrackList(currentPlaylist?.tracks?.items || [])
  }, [currentPlaylist])

  return (
    <Drawer>
      <DrawerTrigger
        asChild
        style={{
          fontFamily: generateFontCss('Poppins'),
        }}
      >
        <div className="w-full cursor-pointer">
          <MusicPlayer />
        </div>
      </DrawerTrigger>
      <DrawerContent
        style={{
          fontFamily: generateFontCss('Poppins'),
        }}
        className="h-[80%] focus:outline-none"
      >
        <Content />
      </DrawerContent>
    </Drawer>
  )
}

const Content = () => {
  const { user } = useSpotifyAuth()
  const [playerContext] = usePlayerContext()
  const [activePlaylist, setActivePlaylist] = useState('')
  const { data: playlists, isLoading, error: playlistError } = useMyPlaylists()

  useEffect(() => {
    setActivePlaylist(playerContext.playlistId)
  }, [!!playerContext.playlistId])

  const { mutate: logout, error } = useLogout({
    onError: (error) => {
      console.log(error)
    },
  })

  if (playlistError) {
    return (
      <div className="h-[80%] w-full flex flex-col justify-center items-center">
        There was an error fetching your playlists.
        <br />
        Please try again later.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-1 gap-2 max-w-[1200px] lg:w-[80%] w-[calc(100vw-2rem)] mt-4 mx-auto">
        {isLoading && (
          <>
            <DrawerSkeleton />
            <PlaylistTabContentSkeleton />
          </>
        )}
        {!isLoading && (
          <>
            <div className="flex flex-col relative">
              <DrawerHeader className="py-0 pb-4">
                <DrawerTitle className="text-xl font-bold">
                  My Playlists
                </DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="h-0 flex flex-col gap-2 pr-4 pb-14">
                  {playlists?.items?.map((playlist) => {
                    return (
                      <PlaylistTab
                        key={playlist.id}
                        playlist={playlist}
                        activePlaylist={activePlaylist}
                        setActivePlaylist={setActivePlaylist}
                      />
                    )
                  })}
                </div>
              </ScrollArea>
              <div className="absolute bottom-0 justify-between h-14 w-[calc(100%-1rem)] bg-background/80 backdrop-blur-md border rounded-md items-center flex px-2">
                <div className="flex gap-2 items-start">
                  <Avatar>
                    <AvatarImage
                      className="object-cover"
                      src={user.data?.images?.[0]?.url}
                    />
                    <AvatarFallback>
                      {user.data?.display_name?.[0] || (
                        <User2 className="h-6 w-6" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="-mt-0.5">
                    <h3 className="font-semibold">{user.data?.display_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {playlists?.items.length} playlists
                    </p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => logout()}
                    >
                      {!error && <LogOutIcon className="w-4 h-4" />}
                      {!!error && (
                        <AlertCircle className="text-rose-500 animate-blink w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Logout</TooltipContent>
                </Tooltip>
              </div>
            </div>
            {!!activePlaylist && (
              <PlaylistTabContent activePlaylist={activePlaylist} />
            )}
            {!activePlaylist && (
              <h2 className="m-auto font-bold text-xl flex gap-2 items-center">
                <ListMusic className="h-10 w-10" />
                No playlist selected
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  )
}
