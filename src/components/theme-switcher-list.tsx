import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Palette, Search } from 'lucide-react'
import { cn, formatThemeName } from '../lib/utils'
import { useStyle } from '../atoms/atoms'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import styleList from '@/styles/theme-list.json'
import { ScrollArea } from './ui/scroll-area'

export const ThemeSwitcherList = () => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useStyle()
  const initialFocusedStyleIndex = useMemo(
    () => styleList.findIndex((s) => s.name == style) || 0,
    []
  )
  const [focusedStyleIndex, setFocusedStyleIndex] = useState(
    initialFocusedStyleIndex
  )
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(
    initialFocusedStyleIndex
  )
  const [search, setSearch] = useState('')
  const [isHoverDisabled, setIsHoverDisabled] = useState(false)

  const filteredStyleList = useMemo(() => {
    const newList = [] as ({ index: number } & (typeof styleList)[number])[]
    styleList.map((s, i) => {
      if (
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        `${i + 1}`.includes(search)
      ) {
        newList.push({ ...s, index: i })
      }
    })
    return newList
  }, [search])

  const handleMouseMove = () => setIsHoverDisabled(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    setFocusedStyleIndex((prev) => {
      let newIdx = prev
      if (!isHoverDisabled) setIsHoverDisabled(true)
      if (e.key === 'ArrowUp') {
        newIdx = prev - 1
        if (prev === 0) newIdx = filteredStyleList.length - 1
      } else if (e.key === 'ArrowDown') {
        newIdx = prev + 1
        if (prev === filteredStyleList.length - 1) newIdx = 0
      }
      const el = document.getElementById(`style-${newIdx}`)
      const elHeight = el?.offsetHeight || 0
      const elPosition = (el?.getBoundingClientRect().y || 0) - elHeight

      const scrollerHeight = scrollerRef.current?.clientHeight || 0
      const scrollerStart = scrollerRef.current?.offsetTop || 0
      const scrollerEnd = scrollerStart + scrollerHeight - elHeight

      if (el && (elPosition < scrollerStart || elPosition > scrollerEnd)) {
        el.scrollIntoView()
      }
      return newIdx
    })
    if (e.key === 'Enter' || e.key === ' ') {
      updateSelectedStyleIndex()
    }
  }
  const updateSelectedStyleIndex = () => {
    const itemIdx = filteredStyleList[focusedStyleIndex]?.index
    setSelectedStyleIndex(itemIdx)
  }

  useEffect(() => {
    setTimeout(() => setStyle(styleList[focusedStyleIndex].name), 100)
  }, [focusedStyleIndex])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [search])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [focusedStyleIndex, search])

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => setStyle(styleList[selectedStyleIndex].name), 200)
        }
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

      <DialogContent className="flex h-fit max-h-[80%] min-w-full flex-col sm:min-w-[80%]">
        <DialogHeader className="w-full">
          <DialogTitle>Themes</DialogTitle>
        </DialogHeader>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<Search className="h-4 w-4" />}
          placeholder="Search"
          className="bg w-full border border-border"
        />
        <ScrollArea ref={scrollerRef} className="overflow-y-auto px-1">
          <div className="min-w-full flex-col gap-1 px-2">
            {filteredStyleList.map((style, idx) => {
              if (!style) return
              const { index: i } = style
              const isActive = idx === focusedStyleIndex
              const isSelected = i === selectedStyleIndex
              return (
                <div
                  id={`style-${idx}`}
                  onMouseEnter={() =>
                    !isHoverDisabled && setFocusedStyleIndex(idx)
                  }
                  onMouseLeave={() =>
                    setStyle(styleList[selectedStyleIndex].name)
                  }
                  onClick={updateSelectedStyleIndex}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-sm border-2 border-transparent px-2 py-1 text-foreground',
                    isActive && 'border-primary bg-primary/20'
                  )}
                >
                  <p className={cn(isSelected && 'flex items-center gap-1')}>
                    {isSelected && <Check className="-mb-1 h-4 w-4" />}
                    {!isSelected && (
                      <span className="text-xs text-muted-foreground">
                        {i + 1}.
                      </span>
                    )}

                    {formatThemeName(style.name)}
                  </p>
                  <div className="flex gap-1">
                    {[style.mainColor, style.textColor, style.subColor].map(
                      (color, i) => {
                        return (
                          <div
                            style={{
                              backgroundColor: color,
                            }}
                            className="flex h-3 w-3 items-center gap-1 rounded-full border border-foreground"
                            key={i}
                          />
                        )
                      }
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
