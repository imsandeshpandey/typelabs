import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string
    thumbClassName?: string
    tooltipContent?: React.ReactNode
  }
>(
  (
    { className, trackClassName, thumbClassName, tooltipContent, ...props },
    ref
  ) => {
    const [thumbHovered, setThumbHovered] = React.useState(false)
    return (
      <SliderPrimitive.Root
        onMouseEnter={() => setThumbHovered(true)}
        onMouseLeave={() => setThumbHovered(false)}
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
            trackClassName
          )}
        >
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          className={cn(
            'block h-5 w-5 relative rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            thumbClassName
          )}
        >
          {tooltipContent !== undefined && thumbHovered && (
            <span
              className={cn(
                'z-50 absolute -top-[120%] left-1/2 -translate-x-1/2 -translate-y-full overflow-hidden rounded-md border bg-popover px-3 py-1.5 w-fit h-fit text-sm text-popover-foreground shadow-md fade-in-0 zoom-in-95'
              )}
            >
              {tooltipContent}
            </span>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    )
  }
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
