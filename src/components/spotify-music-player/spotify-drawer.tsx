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
import { useCurrentTrackInfo, useTrackList } from '@/state/atoms'
import { useEffect, useState } from 'react'
import { useMyPlaylists } from '../../react-query/queries/my-playlists.query'
import { usePlaylist } from '@/react-query/queries/playlist.query'
import { PlaylistTabContentSkeleton } from './playlist/playlist-tab-content.skeleton'
import React from 'react'

export const SpotifyDrawer = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTrackList] = useTrackList()
  const [currentTrackInfo] = useCurrentTrackInfo()
  const { data: currentPlaylist, refetch } = usePlaylist(
    currentTrackInfo.playlistId
  )

  useEffect(() => {
    refetch()
  }, [currentTrackInfo.playlistId])

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
  const [currentTrackInfo] = useCurrentTrackInfo()
  const [activePlaylist, setActivePlaylist] = useState('')
  const { data: playlists, isLoading, error: playlistError } = useMyPlaylists()

  useEffect(() => {
    setActivePlaylist(currentTrackInfo.playlistId)
  }, [!!currentTrackInfo.playlistId])

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
            <div className="flex flex-col">
              <DrawerHeader className="py-0 pb-4">
                <DrawerTitle className="text-xl font-bold">
                  My Playlists
                </DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="h-full overflow-y-auto">
                <div className="h-0 flex flex-col gap-2 pr-4 pb-8">
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
            <PlaylistTabContent activePlaylist={activePlaylist} />
          </>
        )}
      </div>
    </div>
  )
}
