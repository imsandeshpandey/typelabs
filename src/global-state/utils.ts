export const getStoreValuesByKeys =
  <T>(keys: (keyof T)[]) =>
  (state: T) => {
    return keys.reduce(
      (acc, key) => {
        acc[key] = state[key]
        return acc
      },
      {} as { [K in keyof T]: T[K] }
    )
  }
