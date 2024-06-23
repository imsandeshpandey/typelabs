import { Button } from '@/components/ui/button'
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
      size="icon"
      className={cn(
        'justify-normal gap-4 whitespace-normal rounded-lg border-2 border-transparent p-1 text-left hover:bg-muted focus:border-2 focus:border-foreground focus-visible:ring-0 md:min-w-[15rem]',
        'h-12 w-12 justify-center',
        'md:w-auto md:justify-start md:px-4',
        {
          'border-2 border-primary bg-primary/10 focus:border-primary':
            isActive,
        }
      )}
      tooltipContent={playlist.name}
      tooltipContentProps={{
        className: 'md:hidden',
      }}
    >
      <img
        src={playlist.images?.[0].url || defaultPlaylistIcon}
        className="h-8 w-8 rounded-sm"
      />
      <span className="hidden animate-in slide-in-from-left-10 md:block">
        {playlist.name}
      </span>
    </Button>
  )
}
