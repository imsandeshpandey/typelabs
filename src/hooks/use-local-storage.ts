import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [val, setVal] = useState<T>(defaultValue)

  useEffect(() => {
    const localVal = localStorage.getItem(key)
    const parsedVal = localVal ? JSON.parse(localVal) : defaultValue
    setVal(parsedVal)
  }, [key])

  const setValue = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value || ''))
    setVal(value)
  }

  return [val, setValue] as [T, typeof setValue]
}

export const useAtomWithStorage = <T>(key: string, defaultValue: T) => {
  return useAtom(atomWithStorage(key, defaultValue))
}
