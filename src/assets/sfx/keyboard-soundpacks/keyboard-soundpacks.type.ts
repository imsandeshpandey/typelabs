export type KeyboardSoundPackConfig = {
  id: string
  name: string
  key_define_type: 'key' | 'code'
  includes_numpad: boolean
  sound: string
  sprites: Record<string, [number, number]>
}
