import { Button } from '../../ui/button'
import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { cn } from '@/lib/utils'

export const PlaylistTab = ({
  playlist,
  activePlaylist,
  setActivePlaylist,
}: {
  playlist: SpotifyApi.PlaylistObjectSimplified
  activePlaylist: string
  setActivePlaylist: (playlist: string) => void
}) => {
  const isActive = activePlaylist === playlist.id
  return (
    <Button
      onClick={() => setActivePlaylist(playlist.id)}
      variant="ghost"
      className={cn(
        'hover:bg-muted min-w-[15rem] text-left whitespace-normal rounded-lg justify-normal h-12 gap-4 border-2 border-transparent focus-visible:ring-0 focus:border-2 focus:border-foreground',
        {
          'border-2 border-primary bg-primary/10 focus:border-primary':
            isActive,
        }
      )}
    >
      <img
        src={playlist.images?.[0].url || defaultPlaylistIcon}
        className="h-8 w-8 rounded-sm"
      />
      {playlist.name}
    </Button>
  )
}
