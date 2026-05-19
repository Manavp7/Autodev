import api from './client'
import type {
  ProductionLine, Station, WorkOrder, AndonEvent,
  PlantKpi, Breakdown, Defect, SparePart,
} from '../types'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login', { email, password }).then(r => r.data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<any>('/auth/me').then(r => r.data),
}

// ─── Operations ───────────────────────────────────────────────────────────────
export const operationsApi = {
  getKpi: () => api.get<PlantKpi>('/operations/kpi').then(r => r.data),
  getLines: () => api.get<ProductionLine[]>('/operations/lines').then(r => r.data),
  getLine: (id: string) => api.get<ProductionLine>(`/operations/lines/${id}`).then(r => r.data),
  getStations: (lineId?: string) =>
    api.get<Station[]>('/operations/stations', { params: { lineId } }).then(r => r.data),
}

// ─── Work Orders ──────────────────────────────────────────────────────────────
export const workOrdersApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ data: WorkOrder[]; total: number }>('/work-orders', { params }).then(r => r.data),
  get: (id: string) => api.get<WorkOrder>(`/work-orders/${id}`).then(r => r.data),
  create: (payload: Partial<WorkOrder>) =>
    api.post<WorkOrder>('/work-orders', payload).then(r => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch<WorkOrder>(`/work-orders/${id}/status`, { status }).then(r => r.data),
}

// ─── Andon ────────────────────────────────────────────────────────────────────
export const andonApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ data: AndonEvent[]; total: number }>('/andon', { params }).then(r => r.data),
  get: (id: string) => api.get<AndonEvent>(`/andon/${id}`).then(r => r.data),
  raise: (payload: Partial<AndonEvent>) =>
    api.post<AndonEvent>('/andon', payload).then(r => r.data),
  acknowledge: (id: string, assignedTo?: string) =>
    api.patch<AndonEvent>(`/andon/${id}/acknowledge`, { assignedTo }).then(r => r.data),
  resolve: (id: string, payload: { rootCause: string; actionTaken: string }) =>
    api.patch<AndonEvent>(`/andon/${id}/resolve`, payload).then(r => r.data),
}

// ─── Maintenance ──────────────────────────────────────────────────────────────
export const maintenanceApi = {
  getBreakdowns: () =>
    api.get<Breakdown[]>('/maintenance/breakdowns').then(r => r.data),
  getBreakdown: (id: string) =>
    api.get<Breakdown>(`/maintenance/breakdowns/${id}`).then(r => r.data),
  createBreakdown: (payload: Partial<Breakdown>) =>
    api.post<Breakdown>('/maintenance/breakdowns', payload).then(r => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch<Breakdown>(`/maintenance/breakdowns/${id}/status`, { status }).then(r => r.data),
}

// ─── Quality ──────────────────────────────────────────────────────────────────
export const qualityApi = {
  getDefects: (params?: Record<string, string>) =>
    api.get<{ data: Defect[]; total: number }>('/quality/defects', { params }).then(r => r.data),
  logDefect: (payload: Partial<Defect>) =>
    api.post<Defect>('/quality/defects', payload).then(r => r.data),
  setDisposition: (id: string, disposition: string) =>
    api.patch<Defect>(`/quality/defects/${id}/disposition`, { disposition }).then(r => r.data),
  getStats: () => api.get<any>('/quality/stats').then(r => r.data),
}

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventoryApi = {
  getParts: (params?: Record<string, string>) =>
    api.get<{ data: SparePart[]; total: number }>('/inventory/parts', { params }).then(r => r.data),
  addPart: (payload: Partial<SparePart>) =>
    api.post<SparePart>('/inventory/parts', payload).then(r => r.data),
  adjustStock: (id: string, qty: number) =>
    api.patch<SparePart>(`/inventory/parts/${id}/adjust`, { qty }).then(r => r.data),
  getAlerts: () => api.get<SparePart[]>('/inventory/alerts').then(r => r.data),
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () => api.get<any[]>('/users').then(r => r.data),
  get: (id: string) => api.get<any>(`/users/${id}`).then(r => r.data),
  create: (payload: any) => api.post<any>('/users', payload).then(r => r.data),
  update: (id: string, payload: any) => api.patch<any>(`/users/${id}`, payload).then(r => r.data),
}
