import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { useTimer } from '@/global-state/timer.store'

type DivProps = React.HTMLAttributes<HTMLDivElement>

export type BoxProps = DivProps & {
  onClickOutside?: (e: MouseEvent) => void
  gameResponsive?: boolean
  asChild?: boolean
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    { onClickOutside, asChild, gameResponsive = false, ...props },
    forwardedRef
  ) => {
    const Comp = asChild ? Slot : 'div'

    const ref = useRef<HTMLDivElement>(null)
    const { isRunning, isPaused } = useTimer('isRunning', 'isPaused')

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside && onClickOutside(e)
      }
    }
    useImperativeHandle(forwardedRef, () => ref.current!, [])

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    })
    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(
          'transition-opacity',
          props.className,
          gameResponsive && !isPaused && isRunning && 'opacity-0'
        )}
      >
        {props.children}
      </Comp>
    )
  }
)
