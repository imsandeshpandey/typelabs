import { FC, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type AnimatedPlayIconProps = HTMLAttributes<HTMLDivElement> & {
  paused?: boolean
  barProps?: HTMLAttributes<HTMLDivElement>
}

const bars = [
  'delay-100 h-3',
  'delay-300 h-2',
  'delay-200 h-4',
  'delay-100 h-2',
]
export const AnimatedPlayIcon: FC<AnimatedPlayIconProps> = ({
  paused,
  barProps,
  className,
  ...props
}) => {
  const { className: barCn, ...rest } = barProps || {}
  return (
    <div className={cn('flex gap-0.5 items-center', className)} {...props}>
      {bars.map((css, index) => (
        <div
          key={index}
          className={cn(
            'w-0.5 h-4 bg-foreground/20 rounded-full animate-playing',
            css,
            paused && '!animate-none',
            barCn
          )}
          {...rest}
        />
      ))}
    </div>
  )
}
