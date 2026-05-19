import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, iconLeft, iconRight, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {iconLeft && (
          <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
            {iconLeft}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:cursor-not-allowed disabled:opacity-50',
            iconLeft && 'pl-10',
            iconRight && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 flex items-center pointer-events-none text-text-muted">
            {iconRight}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
