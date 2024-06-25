import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Palette, Search } from 'lucide-react'
import { cn, formatThemeName } from '../lib/utils'
import { useStyle } from '../atoms/atoms'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import styleList from '@/styles/theme-list.json'
import { applyTheme } from '@/lib/utils'

export const ThemeSwitcherList = () => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useStyle()
  const [isOpen, setIsOpen] = useState(false)
  const [focusedStyle, setFocusedStyle] = useState(style)
  const [search, setSearch] = useState('')
  const [isHoverDisabled, setIsHoverDisabled] = useState(false)

  const filteredStyleList = useMemo(() => {
    const newList = [] as ({ index: number } & (typeof styleList)[number])[]
    styleList.map((s, i) => {
      const includesName = s.name.toLowerCase().includes(search.toLowerCase())
      const includesIndex = `${i + 1}`.includes(search)

      if (includesName || includesIndex) {
        newList.push({ ...s, index: i })
      }
    })
    return newList
  }, [search])

  const handleMouseMove = () => setIsHoverDisabled(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (filteredStyleList.length === 0) return
    setFocusedStyle((prev) => {
      const prevIdx = filteredStyleList.findIndex((s) => s.name === prev)
      let newIdx = prevIdx
      if (!isHoverDisabled) setIsHoverDisabled(true)

      if (e.key === 'ArrowUp') {
        newIdx = prevIdx - 1
        if (prevIdx === 0) newIdx = filteredStyleList.length - 1
      }
      if (e.key === 'ArrowDown') {
        newIdx = prevIdx + 1
        if (prevIdx === filteredStyleList.length - 1) newIdx = 0
      }

      const el = document.getElementById(`style-${newIdx}`)
      const scrollerHeight = scrollerRef.current?.offsetHeight || 0
      const elHeight = el?.offsetHeight || 0
      const elPos = (el?.getBoundingClientRect().y || 0) - 2 * elHeight
      const scrollerStart = scrollerRef.current?.offsetTop || 0
      const scrollerEnd = scrollerStart + scrollerHeight
      if (el && (elPos < scrollerStart || elPos > scrollerEnd))
        el.scrollIntoView()

      return filteredStyleList[newIdx].name
    })
    if (e.key === 'Enter') updateStyle()
  }
  const updateStyle = () => setStyle(focusedStyle)

  useEffect(() => {
    if (!filteredStyleList.length) return
    setFocusedStyle(filteredStyleList[0].name)
  }, [filteredStyleList])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [search, isOpen])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [focusedStyle, search, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const timeout = setTimeout(() => applyTheme(focusedStyle), 100)
    return () => clearTimeout(timeout)
  }, [focusedStyle])

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open)
        !open && applyTheme(style)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-fit gap-1 text-xs text-muted-foreground"
        >
          <Palette className="h-3 w-3" />
          {style}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-fit max-h-[80%] min-w-full flex-col overflow-hidden sm:min-w-[80%]">
        <DialogHeader className="w-full">
          <DialogTitle className="text-xl font-semibold">Themes</DialogTitle>
          <DialogDescription>
            Select a theme to change the color scheme of the app.
            <br />
            You can also search for a theme by name or the index.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<Search className="h-4 w-4" />}
          placeholder="Search"
          className="bg w-full border border-border"
        />

        <div
          ref={scrollerRef}
          className="scroll flex flex-col gap-1 overflow-y-auto"
        >
          {!filteredStyleList.length && (
            <h2 className="px-2 font-bold">No themes found :(</h2>
          )}
          {filteredStyleList.map((currStyle, idx) => {
            if (!currStyle) return
            const { index: i, name } = currStyle
            const isActive = name === focusedStyle
            const isSelected = name === style
            return (
              <div
                id={`style-${idx}`}
                onMouseEnter={() => !isHoverDisabled && setFocusedStyle(name)}
                onClick={updateStyle}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-sm border-2 border-transparent px-2 py-1 text-foreground',
                  isSelected && 'border-primary bg-primary/20',
                  isActive && 'bg-foreground/20'
                )}
              >
                <p className={cn(isSelected && 'flex items-center gap-1')}>
                  {isSelected && <Check className="-mb-1 h-4 w-4" />}
                  {!isSelected && (
                    <span className="mr-1 text-xs text-muted-foreground">
                      {i + 1}.
                    </span>
                  )}

                  {formatThemeName(name)}
                </p>
                <div className="flex gap-1">
                  {[
                    currStyle.mainColor,
                    currStyle.textColor,
                    currStyle.subColor,
                  ].map((color, i) => {
                    return (
                      <div
                        style={{
                          backgroundColor: color,
                        }}
                        className="flex h-3 w-3 items-center gap-1 rounded-full border border-foreground"
                        key={i}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
