export type Config = {
  id: string
  name: string
  default: boolean
  key_define_type: 'single' | 'multi'
  includes_numpad: boolean
  sound: string
  defines: Record<number, string>[]
  tags: string[]
}
