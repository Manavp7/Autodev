// Lightweight toast provider used across all three modules from a single
// place. Replaces the previous AutoMFG-only ToastProvider import.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

type ToastKind = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  kind: ToastKind
  title: string
  message?: string
  duration: number
}

interface ToastApi {
  toast: (t: { kind?: ToastKind; title: string; message?: string; duration?: number }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastApi | undefined>(undefined)

const ICONS: Record<ToastKind, ReactNode> = {
  success: <CheckCircle2 size={20} className="text-success" />,
  error:   <XCircle size={20} className="text-danger" />,
  warning: <AlertTriangle size={20} className="text-warning" />,
  info:    <Info size={20} className="text-accent" />,
}

let counter = 0
const nextId = () => `t-${Date.now()}-${counter++}`

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback<ToastApi['toast']>((t) => {
    const item: ToastItem = {
      id: nextId(),
      kind: t.kind ?? 'info',
      title: t.title,
      message: t.message,
      duration: t.duration ?? 4000,
    }
    setItems((prev) => [...prev, item])
  }, [])

  useEffect(() => {
    if (!items.length) return
    const timers = items.map((t) =>
      setTimeout(() => dismiss(t.id), t.duration)
    )
    return () => {
      timers.forEach((id) => clearTimeout(id))
    }
  }, [items, dismiss])

  const api = useMemo<ToastApi>(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'glass border border-border-dark rounded-xl shadow-card-hover p-4 flex items-start gap-3 animate-in fade-in slide-in-from-right'
            )}
          >
            <div className="mt-0.5 flex-shrink-0">{ICONS[t.kind]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary text-sm">{t.title}</p>
              {t.message && (
                <p className="text-text-secondary text-xs mt-0.5">{t.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-text-secondary hover:text-text-primary transition"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Fallback no-op so calls never throw outside the provider (rare on first paint).
    return {
      toast: ({ title, message }) => console.info('[toast]', title, message ?? ''),
      dismiss: () => {},
    }
  }
  return ctx
}
