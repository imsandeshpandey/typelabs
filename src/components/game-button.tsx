import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { MouseEvent, ReactNode } from 'react'
import React from 'react'

export type GameButtonProps = {
  label: string
  icon: React.ReactNode
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  shortcut: ReactNode
}

export const GameButton = (props: GameButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={props.onClick}
          variant="ghost"
          className="gap-2 pointer text-md text-muted-foreground"
        >
          {props.icon} {props.label}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs border-foreground/20">
        <div className="flex gap-1 w-fit mx-auto">{props.shortcut}</div>
      </TooltipContent>
    </Tooltip>
  )
}
