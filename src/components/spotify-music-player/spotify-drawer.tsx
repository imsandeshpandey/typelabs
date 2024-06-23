import { useEffect, useState } from 'react'
import { PlaylistTabContent } from './playlist/playlist-tab-content'
import { PlaylistTab } from './playlist/playlist-tab'
import { DrawerSkeleton } from './spotify-drawer.skeleton'
import { generateFontCss } from '@/lib/utils'
import { MusicPlayer } from './music-player'
import { usePlayerContext } from '@/atoms/atoms'
import { useMyPlaylists } from '@/react-query/queries/my-playlists.query'
import { PlaylistTabContentSkeleton } from './playlist/playlist-tab-content.skeleton'
import { ListMusic } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

export const SpotifyDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger
        asChild
        style={{
          fontFamily: generateFontCss('Roboto Mono'),
        }}
      >
        <div className="w-full cursor-pointer">
          <MusicPlayer />
        </div>
      </DrawerTrigger>
      <DrawerContent
        style={{
          fontFamily: generateFontCss('Helvetica Neue'),
          letterSpacing: '0.02em',
        }}
        className="h-[80%] focus:outline-none"
      >
        <Content />
      </DrawerContent>
    </Drawer>
  )
}

const Content = () => {
  const [playerContext] = usePlayerContext()
  const [activePlaylist, setActivePlaylist] = useState('')
  const { data: playlists, isLoading, error: playlistError } = useMyPlaylists()
  useEffect(() => {
    setActivePlaylist(playerContext.playlistId)
  }, [!!playerContext.playlistId])

  if (playlistError) {
    return (
      <div className="flex h-[80%] w-full flex-col items-center justify-center">
        There was an error fetching your playlists.
        <br />
        Please try again later.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="mx-auto mt-4 flex w-[calc(100vw-2rem)] max-w-[1200px] flex-1 gap-2 lg:w-[80%]">
        {isLoading && (
          <>
            <DrawerSkeleton />
            <PlaylistTabContentSkeleton />
          </>
        )}
        {!isLoading && (
          <>
            <div className="relative flex flex-col">
              <DrawerHeader className="py-0 pb-4 pl-1 transition-all md:pl-4">
                <DrawerTitle className="text-left text-sm font-semibold transition-all md:text-xl md:font-bold">
                  Playlists
                </DrawerTitle>
              </DrawerHeader>

              <ScrollArea className="h-full overflow-y-auto">
                <div className="flex h-[12rem] flex-col gap-2 pr-4">
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
            </div>
            {!!activePlaylist && (
              <PlaylistTabContent activePlaylist={activePlaylist} />
            )}
            {!activePlaylist && (
              <h2 className="m-auto flex items-center gap-2 text-xl font-bold">
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
