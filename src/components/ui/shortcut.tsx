import { UserAgent } from '@quentin-sommer/react-useragent'

export const Shortcut = ({ win, mac }: { win: string; mac?: string }) => {
  const macLabel = mac || win

  return (
    <span className="p-1 font-robotoMono min-w-6 grid place-items-center backdrop-blur-sm min-h-4 text-xs border border-muted-foreground/50 shadow-sm rounded-sm bg-background">
      <UserAgent mac>{macLabel}</UserAgent>
      <UserAgent windows>{win}</UserAgent>
    </span>
  )
}
