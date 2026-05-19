import React from 'react'
import { cn } from '@/lib/utils'

export type StatusType = 'running' | 'stopped' | 'delayed' | 'maintenance' | 'starved'
export type MaterialStatusType = 'shortage' | 'lowStock' | 'ready' | 'pending'
export type DispositionType = 'scrap' | 'rework' | 'uai'
export type PriorityType = 'p1' | 'p2' | 'p3' | 'p4'
export type VariantType = 'default' | 'success' | 'warning' | 'danger' | 'accent'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: VariantType
  status?: StatusType
  material?: MaterialStatusType
  disposition?: DispositionType
  priority?: PriorityType
  children?: React.ReactNode
}

const variantClasses = {
  default: "bg-surface border-border-dark text-text-secondary",
  success: "bg-success/10 border-success/20 text-success",
  warning: "bg-warning/10 border-warning/20 text-warning",
  danger:  "bg-danger/10 border-danger/20 text-danger",
  accent:  "bg-accent/10 border-accent/20 text-accent",
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, status, material, disposition, priority, children, ...props }, ref) => {
    
    let badgeClass = variant ? variantClasses[variant] : ''

    if (status) {
      const lineStatus = {
        running: 'bg-success/10 border border-success/20 text-success',
        stopped: 'bg-danger/10 border border-danger/20 text-danger',
        delayed: 'bg-warning/10 border border-warning/20 text-warning',
        maintenance: 'bg-surface border border-border-dark text-text-secondary',
        starved: 'bg-surface border border-border-dark text-text-secondary opacity-70',
      }
      badgeClass = lineStatus[status]
    } else if (material) {
      const materialStatus = {
        shortage: 'bg-danger text-white font-bold',
        lowStock: 'bg-warning/10 border border-warning/20 text-warning',
        ready: 'text-success font-medium',
        pending: 'text-text-secondary',
      }
      badgeClass = materialStatus[material]
    } else if (disposition) {
      const dispStatus = {
        scrap: 'bg-danger/10 border border-danger/20 text-danger font-bold uppercase',
        rework: 'bg-accent/10 border border-accent/20 text-accent font-bold uppercase',
        uai: 'bg-surface border border-border-dark text-text-primary font-bold uppercase',
      }
      badgeClass = dispStatus[disposition]
    } else if (priority) {
      const prioStatus = {
        p1: 'bg-danger text-white text-[11px] px-2 py-0.5 uppercase tracking-widest rounded-full',
        p2: 'bg-danger/80 text-white text-[11px] px-2 py-0.5 uppercase tracking-widest rounded-full',
        p3: 'bg-warning text-white text-[11px] px-2 py-0.5 uppercase tracking-widest rounded-full',
        p4: 'bg-surface border border-border-dark text-text-secondary text-[11px] px-2 py-0.5 uppercase tracking-widest rounded-full',
      }
      badgeClass = prioStatus[priority]
    }

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border', badgeClass, className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'
