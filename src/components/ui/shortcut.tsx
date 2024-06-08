// import { UserAgent } from '@quentin-sommer/react-useragent'

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type ShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  shortcut: string
}
export const Shortcut = ({ shortcut, className, ...rest }: ShortcutProps) => {
  return (
    <span
      className={cn(
        'p-1 font-robotoMono min-w-6 grid place-items-center backdrop-blur-sm min-h-4 text-xs border border-muted-foreground/50 shadow-sm rounded-sm bg-background',
        className
      )}
      {...rest}
    >
      {shortcut}
    </span>
  )
}
