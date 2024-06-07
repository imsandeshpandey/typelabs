import spotifyLogo from '@/assets/svgs/spotify-icon.svg'
import { Link } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { generateFontCss } from '@/lib/utils'
import { Button } from './ui/button'

export const NoSpotifyPremiumButton = () => {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger
        style={{
          fontFamily: generateFontCss('Poppins'),
        }}
        asChild
      >
        <div className="h-12 text-sm w-fit font-semibold cursor-pointer hover:bg-background/20 rounded-md px-4 gap-2 flex items-center">
          <img src={spotifyLogo} alt="spotify" className="h-5" />
          No Premium
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-8sd0"
        style={{
          fontFamily: generateFontCss('Poppins'),
        }}
      >
        <div className="flex justify-between space-x-4">
          <img src={spotifyLogo} alt="spotify" className="h-10" />
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">Premium not found</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Music player requires a premium account to play music.
            </p>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-2 text-xs items-center h-auto py-2 rounded-md"
            >
              <a
                href="https://www.spotify.com/premium/"
                target="_blank"
                rel="noreferrer"
              >
                Get Premium <Link className="h-4 w-4 text-muted-foreground" />
              </a>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
