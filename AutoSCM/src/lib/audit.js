// Frontend-only audit log + e-signature helper. Mirrors audit.ts.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const uid = () => `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

export const useAuditStore = create(
  persist(
    (set, get) => ({
      entries: [],
      record: (entry) => {
        const full = { id: uid(), at: new Date().toISOString(), ...entry }
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

export function recordAudit(entry) {
  return useAuditStore.getState().record(entry)
}

export function buildSignature(pin, userId) {
  const at = new Date().toISOString()
  const fingerprint = `${pin}|${userId ?? 'anon'}|${at}`
  let h = 0
  for (let i = 0; i < fingerprint.length; i++) h = (h * 31 + fingerprint.charCodeAt(i)) | 0
  const signature = `sig_${(h >>> 0).toString(36)}_${at.slice(11, 19).replace(/:/g, '')}`
  return { signature, at, userId }
}

export function verifyPinFormat(pin) {
  return /^\d{4}$/.test(pin)
}
