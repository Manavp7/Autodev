import { create } from 'zustand'
import type { ProductionLine, AndonEvent, PlantKpi } from '../types'
import { mockLines, mockKpi, mockAndonEvents } from '../api/mockData'

interface LiveStore {
  connected: boolean
  lines: ProductionLine[]
  kpi: PlantKpi | null
  recentAndonEvents: AndonEvent[]
  connect: () => void
  disconnect: () => void
}

let mockInterval: ReturnType<typeof setInterval> | null = null

export const useLiveStore = create<LiveStore>((set, get) => ({
  connected: false,
  lines: [],
  kpi: null,
  recentAndonEvents: [],

  connect: () => {
    if (get().connected) return

    console.log('ðŸ“¡ LiveStore: Mock simulation active')
    set({
      connected: true,
      lines: [...mockLines],
      kpi: { ...mockKpi },
      recentAndonEvents: [...mockAndonEvents].slice(0, 5),
    })

    if (mockInterval) clearInterval(mockInterval)
    mockInterval = setInterval(() => {
      set(s => ({
        kpi: s.kpi ? {
          ...s.kpi,
          oee: Math.min(99.9, Math.max(50, parseFloat((s.kpi.oee + (Math.random() - 0.48) * 0.5).toFixed(1)))),
          planActual: s.kpi.planActual + Math.floor(Math.random() * 3),
        } : null,
        lines: s.lines.map(line => ({
          ...line,
          taktActual: line.status === 'running'
            ? Math.max(0, line.taktActual + (Math.random() > 0.5 ? 1 : -1))
            : line.taktActual,
          outputActual: line.status === 'running'
            ? line.outputActual + (Math.random() > 0.7 ? 1 : 0)
            : line.outputActual,
        })),
      }))
    }, 5000)
  },

  disconnect: () => {
    if (mockInterval) { clearInterval(mockInterval); mockInterval = null }
    set({ connected: false })
  },
}))
