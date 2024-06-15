import { useState } from 'react'
export function useOptimistic<T>(
  initialValue: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFn: (value: T) => Promise<any>
) {
  const [value, setValue] = useState(initialValue)
  const [optimisticValue, setOptimisticValue] = useState(initialValue)

  const updateValue = async (newValue: T) => {
    setOptimisticValue(newValue)
    try {
      const updatedValue = await updateFn(newValue)
      setValue(updatedValue)
    } catch (error) {
      setOptimisticValue(value)
    }
  }

  return [optimisticValue, updateValue] as const
}

export default useOptimistic
