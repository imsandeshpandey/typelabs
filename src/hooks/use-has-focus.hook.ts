import { useState, useEffect } from 'react'

export const useHasFocus = (props?: {
  onFocus?: (e: Event) => void
  onBlur?: (e: Event) => void
  id?: string
}) => {
  const [focus, setFocus] = useState(true)

  const handleOnFocus = (e: Event) => {
    setFocus(true)
    props?.onFocus?.(e)
  }

  const handleOnBlur = (e: Event) => {
    setFocus(false)
    props?.onBlur?.(e)
  }

  useEffect(() => {
    const el = (props?.id && document.getElementById(props?.id)) || window

    if (el) {
      el.addEventListener('focus', handleOnFocus)
      el.addEventListener('blur', handleOnBlur)

      return () => {
        el.removeEventListener('focus', handleOnFocus)
        el.removeEventListener('blur', handleOnBlur)
      }
    }
  }, [])

  return [focus]
}
