import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-lg shadow-2xl flex flex-col overflow-hidden bg-surface border border-border-dark rounded-2xl", className)}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-dark bg-surface">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-primary rounded-lg text-text-secondary hover:text-text-primary transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh] bg-surface">{children}</div>
      </div>
    </div>
  )
}
