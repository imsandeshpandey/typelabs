import { useRef, useState } from 'react'
export function useOptimistic<T>(
  initialValue: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFn: (value: T) => Promise<any>
) {
  const lastValue = useRef<T>(initialValue)
  const [optimisticValue, setOptimisticValue] = useState(initialValue)

  const updateValue = async (newValue: T) => {
    setOptimisticValue(newValue)
    try {
      const updatedValue = await updateFn(newValue)
      lastValue.current = updatedValue
    } catch (error) {
      setOptimisticValue(lastValue.current)
    }
  }

  return [optimisticValue, updateValue, setOptimisticValue] as const
}

export default useOptimistic
