// Cross-module domain event bus — the spine of the 8 PRD handoffs.

import { useEffect } from 'react'
import { create } from 'zustand'
import { useNotificationStore } from './notificationStore'

const uid = () => `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

export const useEventBus = create((set) => ({
  events: [],
  emit: (event) => {
    const stored = { id: uid(), emittedAt: Date.now(), event }
    set((s) => ({ events: [...s.events, stored].slice(-500) }))
    autoBroadcast(event)
    listeners.forEach((fn) => {
      try { fn(event) } catch (err) { console.error('[eventBus] listener threw', err) }
    })
  },
  clear: () => set({ events: [] }),
}))

const listeners = new Set()
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useEventBusEffect(type, handler) {
  useEffect(() => {
    return subscribe((e) => {
      if (e.type === type) handler(e)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])
}

function autoBroadcast(e) {
  const push = useNotificationStore.getState().push
  switch (e.type) {
    case 'gate.approved':
      push({ title: `Gate ${e.gate} approved`, message: `Program ${e.programId} cleared Gate ${e.gate}.`, type: 'success', category: 'Gate Review', module: 'DEV', actionPath: `/programs/${e.programId}/timeline` })
      break
    case 'eco.approved':
      push({ title: `ECO ${e.ecoId} approved`, message: `${e.affectedParts.length} parts affected; cut-in ${e.cutInDate}.`, type: 'info', category: 'Engineering Change', module: 'DEV', actionPath: `/engineering-change` })
      break
    case 'bom.released':
      push({ title: `MBOM ${e.mbomId} released`, message: `${e.partNumbers.length} parts released to production planning.`, type: 'success', category: 'BOM', module: 'DEV', actionPath: `/mfg/planning` })
      break
    case 'prototype.parts.needed':
      push({ title: 'Prototype parts requested', message: `${e.parts.length} parts requested for program ${e.programId}.`, type: 'warning', category: 'Procurement', module: 'SCM', actionPath: `/scm/prs` })
      break
    case 'shortage.raised':
      push({ title: `Shortage: ${e.partNumber}`, message: `Gap of ${e.gap} units. Impact: ${e.impactLines.join(', ')}.`, type: 'critical', category: 'Shortage', module: 'SCM', actionPath: `/scm/shortages` })
      break
    case 'quality.hold':
      push({ title: 'Quality hold on WO', message: `WO ${e.woId} placed on hold (defect ${e.defectId}).`, type: 'critical', category: 'Quality', module: 'MFG', actionPath: `/mfg/quality-gate` })
      break
    case 'wo.released':
      push({ title: `WO ${e.woId} released`, message: `Plant ${e.plant}, line ${e.line}.`, type: 'info', category: 'Production', module: 'MFG', actionPath: `/mfg/work-orders` })
      break
    case 'po.acknowledged':
      push({ title: `PO ${e.poId} acknowledged`, message: `Supplier ${e.supplierId} confirmed ETA ${e.etaDate}.`, type: 'success', category: 'Purchase Order', module: 'SCM', actionPath: `/scm/pos` })
      break
    case 'grn.accepted':
      push({ title: `GRN ${e.grnId} accepted`, message: `Materials from PO ${e.poId} cleared IQC.`, type: 'success', category: 'Goods Receipt', module: 'SCM', actionPath: `/scm/grn` })
      break
    default:
      break
  }
}
