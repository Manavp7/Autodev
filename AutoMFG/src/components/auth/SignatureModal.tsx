import { useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { buildSignature, verifyPinFormat, type SignatureRecord } from '../../lib/audit'

interface Props {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
  onConfirm: (sig: SignatureRecord) => void
}

export function SignatureModal({ open, title = 'Confirm with your PIN', description, onClose, onConfirm }: Props) {
  const user = useAuthStore((s) => s.user)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyPinFormat(pin)) {
      setError('Enter a 4-digit PIN.')
      return
    }
    const sig = buildSignature(pin, user?.id)
    setPin('')
    setError(null)
    onConfirm(sig)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="sig-title" className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[125] w-[min(420px,calc(100vw-2rem))] bg-surface border border-border-dark rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between p-5 border-b border-border-dark">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 id="sig-title" className="font-bold text-text-primary">{title}</h2>
              {description && <p className="text-xs text-text-secondary mt-1">{description}</p>}
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="text-xs text-text-secondary">
            Signing as <span className="text-text-primary font-semibold">{user?.name ?? 'Guest'}</span> ({user?.role ?? '—'}).
            Your PIN never leaves the browser.
          </div>
          <div>
            <label htmlFor="sig-pin" className="text-xs font-bold text-text-secondary uppercase tracking-wider">PIN</label>
            <input
              id="sig-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              autoFocus
              className="mt-1 w-full bg-primary border border-border-dark rounded-xl px-4 py-3 tracking-[0.5em] text-center text-lg font-mono"
            />
          </div>
          {error && <p className="text-danger text-xs">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-primary border border-border-dark text-text-secondary hover:text-text-primary">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90">
              Sign &amp; submit
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignatureModal
