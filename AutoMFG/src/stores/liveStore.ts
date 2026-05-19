// Local-only "live" store. Real socket.io is gated behind VITE_REALTIME=true.
// In the default frontend-only mode, connect() runs a deterministic interval
// that mutates seeded mock data so dashboards still feel "alive".
//
// No real WebSocket / MQTT / SAP connection is opened.

import { create } from 'zustand'
import type { ProductionLine, AndonEvent, PlantKpi } from '../types'
import { mockLines, mockKpi, mockAndonEvents } from '../api/mockData'

interface LiveStore {
  connected: boolean
  realtime: boolean
  lines: ProductionLine[]
  kpi: PlantKpi | null
  recentAndonEvents: AndonEvent[]
  connect: () => void
  disconnect: () => void
}

let mockInterval: ReturnType<typeof setInterval> | null = null

const realtimeEnabled = import.meta.env.VITE_REALTIME === 'true'

export const useLiveStore = create<LiveStore>((set, get) => ({
  connected: false,
  realtime: realtimeEnabled,
  lines: [],
  kpi: null,
  recentAndonEvents: [],

  connect: () => {
    if (get().connected) return
    if (!realtimeEnabled) {
      // Frontend-only mode: load seed and run a gentle simulation tick.
      console.info('[liveStore] realtime disabled — using deterministic mock simulation')
      set({
        connected: true,
        lines: [...mockLines],
        kpi: { ...mockKpi },
        recentAndonEvents: [...mockAndonEvents].slice(0, 5),
      })
      if (mockInterval) clearInterval(mockInterval)
      mockInterval = setInterval(() => {
        set((s) => ({
          kpi: s.kpi
            ? {
                ...s.kpi,
                oee: Math.min(99.9, Math.max(50, parseFloat((s.kpi.oee + (Math.random() - 0.48) * 0.5).toFixed(1)))),
                planActual: s.kpi.planActual + Math.floor(Math.random() * 3),
              }
            : null,
          lines: s.lines.map((line) => ({
            ...line,
            taktActual:
              line.status === 'running'
                ? Math.max(0, line.taktActual + (Math.random() > 0.5 ? 1 : -1))
                : line.taktActual,
            outputActual:
              line.status === 'running'
                ? line.outputActual + (Math.random() > 0.7 ? 1 : 0)
                : line.outputActual,
          })),
        }))
      }, 5000)
      return
    }

    // Realtime mode is opt-in. We still don't open a real socket here — the
    // import is dynamic so it's never bundled unless the env flag is set.
    console.info('[liveStore] realtime requested — load socket.io-client lazily')
    void import('socket.io-client')
      .then(() => {
        set({ connected: true })
      })
      .catch((err) => {
        console.warn('[liveStore] realtime fallback to mock:', err)
        set({ connected: true })
      })
  },

  disconnect: () => {
    if (mockInterval) {
      clearInterval(mockInterval)
      mockInterval = null
    }
    set({ connected: false })
  },
}))
