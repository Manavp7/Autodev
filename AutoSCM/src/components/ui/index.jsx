import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("glass rounded-xl p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-base font-bold tracking-tight text-text-primary", className)} {...props}>
      {children}
    </h3>
  );
}

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-surface border-border-dark text-text-secondary",
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning",
    danger: "bg-danger/10 border-danger/20 text-danger",
    accent: "bg-accent/10 border-accent/20 text-accent",
  };
  
  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className={cn("relative w-full max-w-lg shadow-2xl flex flex-col p-0 overflow-hidden bg-surface border border-border-dark rounded-2xl", className)}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-dark bg-surface">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-primary rounded-lg text-text-secondary hover:text-text-primary transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh] bg-surface">
          {children}
        </div>
      </div>
    </div>
  );
}
