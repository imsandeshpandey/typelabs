'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from './ui/select'
import { useTheme } from '@/atoms/atoms'

export function ModeToggle() {
  const [theme, setTheme] = useTheme()

  return (
    <Select
      value={theme}
      onValueChange={(val) => setTheme(val as typeof theme)}
    >
      <SelectTrigger noIcon className="bg-transparent flex border-none gap-2">
        <SunIcon className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectItem value="light" onClick={() => setTheme('light')}>
            Light
          </SelectItem>
          <SelectItem value="dark" onClick={() => setTheme('dark')}>
            Dark
          </SelectItem>
          <SelectItem value="system" onClick={() => setTheme('system')}>
            System
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
