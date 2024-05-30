import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useTimer } from '@/providers/timer-provider'
import { cn } from '@/lib/utils'

type DivProps = React.HTMLAttributes<HTMLDivElement>

export type BoxProps = DivProps & {
  onClickOutside?: (e: MouseEvent) => void
  gameResponsive?: boolean
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (props, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null)
    const isPaused = useTimer('isPaused')
    const isRunning = useTimer('isRunning')

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        console.count('test')
        props.onClickOutside?.(e)
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
      <div
        ref={ref}
        {...props}
        className={cn(
          'transition-opacity',
          props.className,
          !!props.gameResponsive && !isPaused && isRunning && 'opacity-0'
        )}
      >
        {props.children}
      </div>
    )
  }
)
