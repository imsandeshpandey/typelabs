import { ID_TEXT_AREA } from '@/config/ids.config'
import words from '@/config/words.config'
import create from 'zustand-store-addons'
import { timerStore } from './timer.store'
import { useShallow } from 'zustand/react/shallow'
import { getStoreValuesByKeys } from './utils'

export type EngineStore = {
  text: string[]
  textString: string
  caretPosition: { x: number; y: number }
  userInput: string
  textAreaFocus: boolean

  setTextAreaFocus: (textAreaFocus: boolean) => void
  setText: (text: EngineStore['text']) => void
  setCaretPosition: (newPos: EngineStore['caretPosition']) => void
  setUserInput: (newUserInput: EngineStore['userInput']) => void

  restart: () => void
  generateText: () => void
  appendText: () => void
  focusTextArea: () => void
}

export const useEngine = <T extends keyof EngineStore>(...keys: T[]) =>
  engineStore(useShallow(getStoreValuesByKeys(keys)))

export const engineStore = create<EngineStore>(
  (set, get) => ({
    text: [],
    textString: '',
    caretPosition: { x: 0, y: 0 },
    userInput: '',
    textAreaFocus: true,
    /********************************************************************/
    setTextAreaFocus: (textAreaFocus: boolean) => {
      timerStore.getState().pauseTimer()
      set((s) => ({ ...s, textAreaFocus }))
    },
    setCaretPosition: (caretPosition: EngineStore['caretPosition']) => {
      set((s) => ({ ...s, caretPosition }))
    },
    setUserInput: (userInput: EngineStore['userInput']) => {
      set((s) => ({ ...s, userInput }))
    },
    setText: (text: EngineStore['text']) => {
      set((s) => ({ ...s, text }))
    },

    restart: () => {
      const { focusTextArea, setUserInput, setCaretPosition } = get()

      focusTextArea()
      setUserInput('')
      setCaretPosition({ x: 0, y: 0 })

      timerStore.getState().resetTimer()
    },
    generateText: () => {
      const { focusTextArea, restart, setText } = get()
      const { setHasTimerEnded, resetTimer } = timerStore.getState()

      focusTextArea()
      setHasTimerEnded(false)
      resetTimer()

      const currText = []

      while (currText.length < 45) {
        const index = (Math.random() * (words.length - 1)) >> 0
        currText.push(words[index])
      }

      restart()
      setText(currText)
    },
    appendText: () => {
      const { text, setText } = get()
      const newWords = [...text]

      while (newWords.length < text.length + 45) {
        const index = (Math.random() * words.length) >> 0
        newWords.push(words[index])
      }

      setText(newWords)
    },
    focusTextArea: () => document.getElementById(ID_TEXT_AREA)?.focus(),
  }),
  {
    computed: {
      textString() {
        return this.text.join(' ')
      },
    },
  }
)
