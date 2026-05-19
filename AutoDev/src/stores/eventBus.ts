// Cross-module domain event bus — the spine of the 8 PRD handoffs.
// Listeners subscribe via useEventBusEffect(type, handler).

import { useEffect } from 'react'
import { create } from 'zustand'
import { useNotificationStore } from './notificationStore'

export type DomainEvent =
  | { type: 'program.created'; programId: string; name: string }
  | { type: 'gate.approved'; programId: string; gate: number }
  | { type: 'bom.released'; programId: string; mbomId: string; partNumbers: string[] }
  | { type: 'eco.approved'; ecoId: string; affectedParts: string[]; cutInDate: string }
  | { type: 'prototype.parts.needed'; programId: string; parts: { pn: string; qty: number }[] }
  | { type: 'ppap.kickoff'; supplierId: string; partNumber: string }
  | { type: 'plan.approved'; planId: string; lineId: string }
  | { type: 'wo.released'; woId: string; plant: string; line: string; materials?: { pn: string; qty: number }[] }
  | { type: 'wo.completed'; woId: string; vin?: string }
  | { type: 'quality.hold'; woId: string; defectId: string }
  | { type: 'shortage.raised'; partNumber: string; gap: number; impactLines: string[] }
  | { type: 'pr.approved'; prId: string; total: number }
  | { type: 'po.acknowledged'; poId: string; supplierId: string; etaDate: string }
  | { type: 'grn.accepted'; grnId: string; poId: string }
  | { type: 'scrap.posted'; woId: string; cost: number }

export interface StoredEvent {
  id: string
  emittedAt: number
  event: DomainEvent
}

interface BusState {
  events: StoredEvent[]
  emit: (e: DomainEvent) => void
  clear: () => void
}

const uid = () => `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

export const useEventBus = create<BusState>((set, get) => ({
  events: [],
  emit: (event) => {
    const stored: StoredEvent = { id: uid(), emittedAt: Date.now(), event }
    set((s) => ({ events: [...s.events, stored].slice(-500) }))
    autoBroadcast(event)
    // Notify any subscribers attached imperatively (rare).
    listeners.forEach((fn) => {
      try {
        fn(event)
      } catch (err) {
        console.error('[eventBus] listener threw', err)
      }
    })
  },
  clear: () => set({ events: [] }),
}))

// ----- Imperative subscribe (for non-React callers) -----
type Listener = (e: DomainEvent) => void
const listeners = new Set<Listener>()
export function subscribe(fn: Listener) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// ----- React hook: run handler whenever event of given type is emitted -----
export function useEventBusEffect<TType extends DomainEvent['type']>(
  type: TType,
  handler: (e: Extract<DomainEvent, { type: TType }>) => void
) {
  useEffect(() => {
    return subscribe((e) => {
      if (e.type === type) handler(e as Extract<DomainEvent, { type: TType }>)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])
}

// ----- Auto-broadcast: critical events get a notification surfaced -----
function autoBroadcast(e: DomainEvent) {
  const push = useNotificationStore.getState().push
  switch (e.type) {
    case 'gate.approved':
      push({
        title: `Gate ${e.gate} approved`,
        message: `Program ${e.programId} cleared Gate ${e.gate}.`,
        type: 'success',
        category: 'Gate Review',
        module: 'DEV',
        actionPath: `/programs/${e.programId}/timeline`,
      })
      break
    case 'eco.approved':
      push({
        title: `ECO ${e.ecoId} approved`,
        message: `${e.affectedParts.length} parts affected; cut-in ${e.cutInDate}.`,
        type: 'info',
        category: 'Engineering Change',
        module: 'DEV',
        actionPath: `/engineering-change`,
      })
      break
    case 'bom.released':
      push({
        title: `MBOM ${e.mbomId} released`,
        message: `${e.partNumbers.length} parts released to production planning.`,
        type: 'success',
        category: 'BOM',
        module: 'DEV',
        actionPath: `/mfg/planning`,
      })
      break
    case 'prototype.parts.needed':
      push({
        title: 'Prototype parts requested',
        message: `${e.parts.length} parts requested for program ${e.programId}.`,
        type: 'warning',
        category: 'Procurement',
        module: 'SCM',
        actionPath: `/scm/prs`,
      })
      break
    case 'shortage.raised':
      push({
        title: `Shortage: ${e.partNumber}`,
        message: `Gap of ${e.gap} units. Impact: ${e.impactLines.join(', ')}.`,
        type: 'critical',
        category: 'Shortage',
        module: 'SCM',
        actionPath: `/scm/shortages`,
      })
      break
    case 'quality.hold':
      push({
        title: 'Quality hold on WO',
        message: `WO ${e.woId} placed on hold (defect ${e.defectId}).`,
        type: 'critical',
        category: 'Quality',
        module: 'MFG',
        actionPath: `/mfg/quality-gate`,
      })
      break
    case 'wo.released':
      push({
        title: `WO ${e.woId} released`,
        message: `Plant ${e.plant}, line ${e.line}.`,
        type: 'info',
        category: 'Production',
        module: 'MFG',
        actionPath: `/mfg/work-orders`,
      })
      break
    case 'po.acknowledged':
      push({
        title: `PO ${e.poId} acknowledged`,
        message: `Supplier ${e.supplierId} confirmed ETA ${e.etaDate}.`,
        type: 'success',
        category: 'Purchase Order',
        module: 'SCM',
        actionPath: `/scm/pos`,
      })
      break
    case 'grn.accepted':
      push({
        title: `GRN ${e.grnId} accepted`,
        message: `Materials from PO ${e.poId} cleared IQC.`,
        type: 'success',
        category: 'Goods Receipt',
        module: 'SCM',
        actionPath: `/scm/grn`,
      })
      break
    default:
      // not all events are user-facing
      break
  }
}
