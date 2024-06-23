export const getStoreValuesByKeys =
  <S extends Record<string, unknown>, T extends keyof S>(keys: T[]) =>
  (state: S) => {
    return keys.reduce(
      (acc, key) => {
        acc[key] = state[key]
        return acc
      },
      {} as { [K in T]: S[K] }
    )
  }
