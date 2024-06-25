import { HTMLProps, ReactNode } from 'react'
import { ResetButton } from '../compound-ui/reset-button'

export type SettingProps = HTMLProps<HTMLDivElement> & {
  title?: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  resetAction?: () => void
  children: ReactNode
}
export const Setting = ({
  title,
  subtitle,
  description,
  children,
  resetAction,
  ...props
}: SettingProps) => {
  return (
    <div className="mb-8" {...props}>
      <div className="mb-4">
        <h2 className="mb-1 flex items-center text-xl font-bold">
          {title}
          {resetAction && <ResetButton onClick={resetAction} />}
        </h2>
        {subtitle && <h3 className="text-lg font-semibold">{subtitle}</h3>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
