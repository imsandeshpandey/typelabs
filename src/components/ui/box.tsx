import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

type DivProps = React.HTMLAttributes<HTMLDivElement>

export type BoxProps = DivProps & {
  onClickOutside?: (e: MouseEvent) => void
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (props, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null)

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
      <div ref={ref} {...props}>
        {props.children}
      </div>
    )
  }
)
