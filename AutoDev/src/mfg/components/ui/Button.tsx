import React, { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'andon'
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent/90 active:scale-95',
      secondary: 'bg-surface border border-border-dark text-text-primary hover:bg-primary',
      outline: 'bg-surface border border-border-dark text-text-secondary hover:text-text-primary hover:bg-primary',
      ghost: 'bg-transparent text-text-secondary hover:bg-surface',
      danger: 'bg-red-600 text-white shadow-lg shadow-red-500/20 hover:bg-red-700 active:scale-95',
      andon: 'bg-red-600 text-white font-bold tracking-wide hover:bg-red-700 animate-pulse',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-[12px] leading-[16px]',
      md: 'px-4 py-2 text-[13px] leading-[20px]',
      lg: 'px-6 py-3 text-[14px] leading-[20px] font-medium',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        {children}
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'
