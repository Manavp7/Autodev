// Frontend-only audit log + e-signature helper.
// Persists to localStorage under 'auto-suite-audit'. No real backend involved.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuditEntry {
  id: string
  at: string
  entity: string
  entityId: string
  action: string
  before?: unknown
  after?: unknown
  userId?: string
  userName?: string
  signature?: SignatureRecord
}

export interface SignatureRecord {
  signature: string
  at: string
  userId?: string
  userName?: string
}

interface AuditState {
  entries: AuditEntry[]
  record: (entry: Omit<AuditEntry, 'id' | 'at'>) => AuditEntry
  clear: () => void
  forEntity: (entity: string, entityId: string) => AuditEntry[]
}

const uid = () => `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      entries: [],
      record: (entry) => {
        const full: AuditEntry = { id: uid(), at: new Date().toISOString(), ...entry }
        set((s) => ({ entries: [full, ...s.entries].slice(0, 1000) }))
        return full
      },
      clear: () => set({ entries: [] }),
      forEntity: (entity, entityId) =>
        get().entries.filter((e) => e.entity === entity && e.entityId === entityId),
    }),
    { name: 'auto-suite-audit' }
  )
)

// Convenience wrapper: most callers just need `recordAudit({...})`.
export function recordAudit(entry: Omit<AuditEntry, 'id' | 'at'>) {
  return useAuditStore.getState().record(entry)
}

// ---------- E-signature ----------
// Hash a PIN + timestamp + user id into an opaque token that we stamp into
// the audit log. This is *not* cryptographically meaningful — it's a UX stub
// that lets us show "signed" state in the UI without involving DocuSign or
// any external service.

export function buildSignature(pin: string, userId?: string): SignatureRecord {
  const at = new Date().toISOString()
  const fingerprint = `${pin}|${userId ?? 'anon'}|${at}`
  let h = 0
  for (let i = 0; i < fingerprint.length; i++) {
    h = (h * 31 + fingerprint.charCodeAt(i)) | 0
  }
  const signature = `sig_${(h >>> 0).toString(36)}_${at.slice(11, 19).replace(/:/g, '')}`
  return { signature, at, userId }
}

export function verifyPinFormat(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}
