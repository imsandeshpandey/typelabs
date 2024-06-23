import { ResetIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'
import { ComponentProps } from 'react'

type ResetButtonProps = ComponentProps<typeof Button>

export const ResetButton = (props: ResetButtonProps) => {
  return (
    <Button variant="ghost" size="icon" tooltipContent="Reset" {...props}>
      <ResetIcon className="h-4 w-4 text-muted-foreground" />
    </Button>
  )
}
