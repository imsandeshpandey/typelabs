import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type RadioTitleProps = HTMLAttributes<HTMLHeadingElement>

export const RadioCardTitle = (props: RadioTitleProps) => {
  return (
    <h2 className={cn('text-foreground text-xl', props.className)} {...props} />
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
}
export const RadioCard = ({ isActive, className, ...rest }: RadioCardProps) => {
  return (
    <button
      className={cn(
        'cursor-pointer text-left outline outline-1 outline-foreground/20 rounded-md px-4 py-2 focus:outline-foreground focus:outline-2',
        {
          'bg-primary/10 outline-primary outline-2 focus:outline-initial':
            isActive,
        },
        className
      )}
      {...rest}
    />
  )
}
