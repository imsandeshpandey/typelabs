import { Button } from '@/components/ui/button'
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
    <Button
      onClick={props.onClick}
      variant="ghost"
      className="pointer text-md gap-2 text-muted-foreground"
      tooltipContent={
        <div className="mx-auto flex w-fit gap-1">{props.shortcut}</div>
      }
      tooltipContentProps={{
        className: '',
      }}
    >
      {props.icon} {props.label}
    </Button>
  )
}
