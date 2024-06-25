import { Button } from '../../ui/button'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type BorderRadiusVisualizerProps = ComponentProps<typeof Button> & {
  radius: number
  isActive?: boolean
}

export const BorderRadiusVisualizer = ({
  radius,
  isActive,
  ...rest
}: BorderRadiusVisualizerProps) => {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        className={cn(
          'relative h-8 w-8 overflow-hidden rounded-md outline outline-1 outline-foreground/20 hover:bg-foreground/10',
          isActive && 'bg-primary/20 outline-2 outline-primary'
        )}
        {...rest}
      >
        <div
          style={{
            borderRadius: radius,
          }}
          className={cn(
            'absolute left-1/4 top-1/4 h-10 w-10 border-2 border-foreground/80',
            isActive && 'border-main'
          )}
        />
      </Button>
      <p className="bottom-0 left-0 right-0 translate-y-1 text-xs text-muted-foreground">
        {radius}px
      </p>
    </div>
  )
}
