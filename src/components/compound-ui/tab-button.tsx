import { Button } from '../ui/button'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const TabButton = (props: {
  icon?: ReactNode
  label: string
  tabIndex: number
  isActive: boolean
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}) => {
  const activeClassName =
    props.isActive &&
    'hover:bg-initial bg-primary/20 text-foreground outline outline-2 outline-primary'

  return (
    <Button
      onClick={() => props.setCurrentTab(props.label)}
      variant="ghost"
      className={cn(
        'justify-normal gap-2 text-muted-foreground hover:bg-muted hover:text-accent-foreground',
        activeClassName
      )}
    >
      {props.icon}
      {props.label}
    </Button>
  )
}
