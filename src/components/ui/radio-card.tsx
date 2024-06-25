import { cn } from '@/lib/utils'
import { ComponentProps, HTMLAttributes, ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

type RadioTitleProps = HTMLAttributes<HTMLHeadingElement>

export const RadioCardTitle = (props: RadioTitleProps) => {
  return (
    <h2 className={cn('text-xl text-foreground', props.className)} {...props} />
  )
}

export const RadioCardDescription = (props: RadioTitleProps) => {
  return (
    <h2 className={cn('text-muted-foreground', props.className)} {...props} />
  )
}

type RadioCardContentProps = HTMLAttributes<HTMLDivElement>

export const RadioCardContent = (props: RadioCardContentProps) => {
  return <div {...props} />
}

export type RadioCardProps = HTMLAttributes<HTMLButtonElement> & {
  isActive: boolean
  tooltipContent?: ReactNode
  tooltipContentProps?: ComponentProps<typeof TooltipContent>
}
export const RadioCard = ({
  isActive,
  className,
  tooltipContent,
  tooltipContentProps,
  ...rest
}: RadioCardProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            'cursor-pointer rounded-md px-4 py-2 text-left outline outline-1 outline-foreground/20 transition-all hover:bg-foreground/5 hover:outline-foreground focus:outline-2 focus:outline-foreground',
            {
              'focus:outline-initial bg-primary/10 outline-2 outline-primary':
                isActive,
            },
            className
          )}
          {...rest}
        />
      </TooltipTrigger>
      {!!tooltipContent && (
        <TooltipContent {...tooltipContentProps}>
          {tooltipContent}
        </TooltipContent>
      )}
    </Tooltip>
  )
}
