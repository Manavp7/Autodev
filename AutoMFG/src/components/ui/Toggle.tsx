import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <label className={cn('relative inline-flex items-center cursor-pointer', className)}>
        <input type="checkbox" className="sr-only peer" checked={checked} ref={ref} {...props} />
        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest-600"></div>
      </label>
    )
  }
)
Toggle.displayName = 'Toggle'
