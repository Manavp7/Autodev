// ─── Auth ───────────────────────────────────────────────────────────────────

export type User = {
  id: string
  name: string
  email: string
  role: 'plant_manager' | 'supervisor' | 'operator' | 'maintenance' | 'quality' | 'admin'
  badgeId: string
  plant: string
  avatarInitials: string
  isActive: boolean
}

export type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ─── Plant / Shift ───────────────────────────────────────────────────────────

export type ShiftName = 'A' | 'B' | 'C'

export type Shift = {
  name: ShiftName
  label: string
  start: string
  end: string
}

export type Plant = {
  id: string
  name: string
  code: string
  timezone: string
}

// ─── Lines & Stations ────────────────────────────────────────────────────────

export type LineStatus = 'running' | 'stopped' | 'delayed' | 'starved' | 'maintenance'

export type ProductionLine = {
  id: string
  name: string
  category: string
  status: LineStatus
  currentWo: string
  taktActual: number  // seconds
  taktTarget: number  // seconds
  outputActual: number
  outputTarget: number
  oee: number         // 0–100
  faultDescription?: string
  downtimeMinutes?: number
}

export type Station = {
  id: string
  lineId: string
  name: string
  process: string
  status: LineStatus
  taktActual: number
  taktTarget: number
  operatorId?: string
  lastSignoff?: string
  holdReason?: string
}

// ─── Work Orders ─────────────────────────────────────────────────────────────

export type WoStatus = 'pending' | 'released' | 'in_progress' | 'completed' | 'closed' | 'on_hold'
export type MaterialStatus = 'ready' | 'shortage' | 'lowStock' | 'pending'

export type WorkOrder = {
  id: string
  partNumber: string
  plant: string
  line: string
  operations: string[]
  stdTime: number   // hours
  actTime?: number  // hours
  materialStatus: MaterialStatus
  plannedQty: number
  actualQty: number
  status: WoStatus
  targetDate: string
  createdAt: string
}

// ─── Andon Events ────────────────────────────────────────────────────────────

export type AndonType = 'fault' | 'quality' | 'shortage' | 'safety' | 'time' | 'handover'
export type AndonStatus = 'open' | 'acknowledged' | 'resolved'
export type AndonPriority = 'critical' | 'high' | 'medium' | 'low'

export type AndonEvent = {
  id: string
  lineId: string
  stationId?: string
  type: AndonType
  status: AndonStatus
  priority: AndonPriority
  title: string
  description: string
  raisedBy: string
  assignedTo?: string
  raisedAt: string
  acknowledgedAt?: string
  resolvedAt?: string
  slaMinutes: number
  slaBreached: boolean
  rootCause?: string
  actionTaken?: string
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export type PlantKpi = {
  planActual: number
  planTarget: number
  oee: number
  oeeTarget: number
  andonEventsToday: number
  activeBreakdowns: number
  linesStopped: number
}

// ─── Maintenance ─────────────────────────────────────────────────────────────

export type BreakdownPriority = 'p1' | 'p2' | 'p3' | 'p4'
export type BreakdownStatus = 'open' | 'in_progress' | 'escalated' | 'resolved'

export type Breakdown = {
  id: string
  machineId: string
  machineName: string
  location: string
  priority: BreakdownPriority
  status: BreakdownStatus
  faultCode?: string
  title: string
  description: string
  reportedBy: string
  assignedTo?: string
  reportedAt: string
  resolvedAt?: string
  slaBreached: boolean
  downtimeMinutes: number
  partsRequired: PartRequest[]
}

export type PartRequest = {
  partNumber: string
  description: string
  qty: number
  onHand: number
}

// ─── Quality ─────────────────────────────────────────────────────────────────

export type DispositionType = 'scrap' | 'rework' | 'uai' | 'pending'

export type Defect = {
  id: string
  partNumber: string
  stationId: string
  defectType: string
  qty: number
  disposition: DispositionType
  loggedBy: string
  loggedAt: string
  cost?: number
  woId?: string
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export type StockStatus = 'ok' | 'reorder' | 'stockout'

export type SparePart = {
  id: string
  partNumber: string
  description: string
  category: string
  location?: string
  onHand: number
  minLevel: number
  maxLevel: number
  unitCost: number
  status: StockStatus
}

// ─── Socket Events ────────────────────────────────────────────────────────────

export type SocketAndonEvent = {
  type: 'andon:new' | 'andon:update' | 'andon:resolved'
  payload: AndonEvent
}

export type SocketLineEvent = {
  type: 'line:status'
  payload: ProductionLine
}

export type SocketKpiEvent = {
  type: 'kpi:update'
  payload: PlantKpi
}
