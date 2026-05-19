import * as mockData from './mockData'
import type { BreakdownStatus, WoStatus, AndonStatus } from '../types'

// ─── Stateful In-Memory Database ─────────────────────────────────────────────
// All mutations here persist for the session. Pages that use this db
// will see real CRUD behavior without a backend.

export const db = {
  users: [...mockData.MOCK_USERS],
  kpi: { ...mockData.mockKpi },
  lines: [...mockData.mockLines],
  stations: [...mockData.mockStations],
  workOrders: [...mockData.mockWorkOrders],
  andonEvents: [...mockData.mockAndonEvents],
  breakdowns: [...mockData.mockBreakdowns],
  defects: [...mockData.mockDefects],
  parts: [...mockData.mockParts],
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export const mutations = {
  // Work Orders
  addWorkOrder: (wo: any) => {
    const id = `WO-${Math.floor(10000 + Math.random() * 90000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
    const newWo = { ...wo, id, actualQty: 0, createdAt: new Date().toISOString() }
    db.workOrders.unshift(newWo)
    return newWo
  },
  updateWorkOrderStatus: (id: string, status: WoStatus) => {
    const wo = db.workOrders.find(w => w.id === id)
    if (wo) wo.status = status
    return wo
  },
  deleteWorkOrder: (id: string) => {
    db.workOrders = db.workOrders.filter(w => w.id !== id)
  },

  // Andon
  raiseAndon: (payload: any) => {
    const id = `AND-${Math.floor(9000 + Math.random() * 999)}`
    const newEvent = {
      ...payload,
      id,
      status: 'open' as AndonStatus,
      raisedBy: db.users[0]?.name ?? 'Operator',
      raisedAt: new Date().toISOString(),
      slaBreached: false,
    }
    db.andonEvents.unshift(newEvent)
    db.kpi.andonEventsToday += 1
    return newEvent
  },
  acknowledgeAndon: (id: string) => {
    const event = db.andonEvents.find(e => e.id === id)
    if (event) {
      event.status = 'acknowledged'
      event.acknowledgedAt = new Date().toISOString()
    }
    return event
  },
  resolveAndon: (id: string, payload: { rootCause: string; actionTaken: string }) => {
    const event = db.andonEvents.find(e => e.id === id)
    if (event) {
      event.status = 'resolved'
      event.resolvedAt = new Date().toISOString()
      event.rootCause = payload.rootCause
      event.actionTaken = payload.actionTaken
    }
    return event
  },

  // Breakdowns
  createBreakdown: (payload: any) => {
    const id = `TKT-${Math.floor(8000 + Math.random() * 999)}`
    const newB = {
      ...payload,
      id,
      status: 'open' as BreakdownStatus,
      reportedAt: new Date().toISOString(),
      slaBreached: false,
      downtimeMinutes: 0,
      partsRequired: [],
    }
    db.breakdowns.unshift(newB)
    db.kpi.activeBreakdowns += 1
    // Stop the affected line
    const line = db.lines.find(l => l.name === payload.lineName || l.id === payload.lineId)
    if (line) {
      line.status = 'stopped'
      line.faultDescription = payload.title
      db.kpi.linesStopped = db.lines.filter(l => l.status === 'stopped').length
    }
    return newB
  },
  updateBreakdownStatus: (id: string, status: BreakdownStatus) => {
    const b = db.breakdowns.find(b => b.id === id)
    if (b) {
      const wasActive = b.status !== 'resolved'
      b.status = status
      if (status === 'resolved') {
        b.resolvedAt = new Date().toISOString()
        if (wasActive) db.kpi.activeBreakdowns = Math.max(0, db.kpi.activeBreakdowns - 1)
      }
    }
    return b
  },

  // Defects
  logDefect: (payload: any) => {
    const id = `D-${Math.floor(8000 + Math.random() * 999)}`
    const newD = {
      ...payload,
      id,
      loggedAt: new Date().toISOString(),
    }
    db.defects.unshift(newD)
    return newD
  },
  setDefectDisposition: (id: string, disposition: string) => {
    const d = db.defects.find(d => d.id === id)
    if (d) d.disposition = disposition as any
    return d
  },

  // Inventory
  addPart: (payload: any) => {
    const newP = { ...payload, id: `sp${Date.now()}`, status: payload.onHand <= 0 ? 'stockout' : payload.onHand < payload.minLevel ? 'reorder' : 'ok' }
    db.parts.push(newP)
    return newP
  },
  adjustStock: (id: string, qty: number) => {
    const part = db.parts.find(p => p.id === id)
    if (part) {
      part.onHand = Math.max(0, part.onHand + qty)
      part.status = part.onHand <= 0 ? 'stockout' : part.onHand < part.minLevel ? 'reorder' : 'ok'
    }
    return part
  },

  // Users
  addUser: (payload: any) => {
    const id = `u${Date.now()}`
    const newUser = { ...payload, id, isActive: true }
    db.users.push(newUser)
    return newUser
  },
  updateUser: (id: string, payload: any) => {
    const idx = db.users.findIndex(u => u.id === id)
    if (idx !== -1) db.users[idx] = { ...db.users[idx], ...payload }
    return db.users[idx]
  },
  toggleUserActive: (id: string) => {
    const user = db.users.find(u => u.id === id)
    if (user) user.isActive = !user.isActive
    return user
  },
}
