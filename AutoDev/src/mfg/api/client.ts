import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { db, mutations } from './mockDb'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('automfg_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('automfg_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// --- Mock Adapter -------------------------------------------------------------
const mock = new MockAdapter(api, { delayResponse: 400 })

// Auth
mock.onPost('/auth/login').reply(config => {
  const { email } = JSON.parse(config.data)
  const user = db.users.find(u => u.email === email) ?? db.users[db.users.length - 1]
  return [200, { token: 'mock-jwt-token', user }]
})
mock.onPost('/auth/logout').reply(200)
mock.onGet('/auth/me').reply(() => [200, db.users[0]])

// Operations
mock.onGet('/operations/kpi').reply(() => [200, { ...db.kpi }])
mock.onGet('/operations/lines').reply(() => [200, [...db.lines]])
mock.onGet(/\/operations\/lines\/[\w-]+/).reply(config => {
  const id = config.url?.split('/').pop()
  return [200, db.lines.find(l => l.id === id) ?? db.lines[0]]
})
mock.onGet('/operations/stations').reply(config => {
  const lineId = (config.params as any)?.lineId
  const stations = lineId ? db.stations.filter(s => s.lineId === lineId) : db.stations
  return [200, stations]
})

// Work Orders
mock.onGet('/work-orders').reply(config => {
  const p = config.params as any
  let list = [...db.workOrders]
  if (p?.status && p.status !== 'all') list = list.filter(w => w.status === p.status)
  if (p?.search) list = list.filter(w => w.id.toLowerCase().includes(p.search.toLowerCase()) || w.partNumber.toLowerCase().includes(p.search.toLowerCase()))
  const page = parseInt(p?.page ?? '1')
  const limit = parseInt(p?.limit ?? '20')
  const total = list.length
  return [200, { data: list.slice((page - 1) * limit, page * limit), total }]
})
mock.onPost('/work-orders').reply(config => {
  const payload = JSON.parse(config.data)
  return [201, mutations.addWorkOrder(payload)]
})
mock.onPatch(/\/work-orders\/[\w-]+\/status/).reply(config => {
  const parts = config.url!.split('/')
  const id = parts[parts.length - 2]
  const { status } = JSON.parse(config.data)
  return [200, mutations.updateWorkOrderStatus(id, status)]
})
mock.onDelete(/\/work-orders\/[\w-]+/).reply(config => {
  const id = config.url!.split('/').pop()!
  mutations.deleteWorkOrder(id)
  return [200, { success: true }]
})

// Andon
mock.onGet('/andon').reply(config => {
  const p = config.params as any
  let list = [...db.andonEvents]
  if (p?.status && p.status !== 'all') list = list.filter(e => e.status === p.status)
  return [200, { data: list, total: list.length }]
})
mock.onPost('/andon').reply(config => {
  return [201, mutations.raiseAndon(JSON.parse(config.data))]
})
mock.onPatch(/\/andon\/[\w-]+\/acknowledge/).reply(config => {
  const id = config.url!.split('/').slice(-2, -1)[0]
  return [200, mutations.acknowledgeAndon(id)]
})
mock.onPatch(/\/andon\/[\w-]+\/resolve/).reply(config => {
  const id = config.url!.split('/').slice(-2, -1)[0]
  return [200, mutations.resolveAndon(id, JSON.parse(config.data))]
})

// Maintenance
mock.onGet('/maintenance/breakdowns').reply(() => [200, [...db.breakdowns]])
mock.onPost('/maintenance/breakdowns').reply(config => {
  return [201, mutations.createBreakdown(JSON.parse(config.data))]
})
mock.onPatch(/\/maintenance\/breakdowns\/[\w-]+\/status/).reply(config => {
  const id = config.url!.split('/').slice(-2, -1)[0]
  const { status } = JSON.parse(config.data)
  return [200, mutations.updateBreakdownStatus(id, status)]
})

// Quality
mock.onGet('/quality/defects').reply(config => {
  const p = config.params as any
  let list = [...db.defects]
  if (p?.disposition && p.disposition !== 'all') list = list.filter(d => d.disposition === p.disposition)
  if (p?.search) list = list.filter(d => d.partNumber.toLowerCase().includes(p.search.toLowerCase()) || d.id.toLowerCase().includes(p.search.toLowerCase()))
  return [200, { data: list, total: list.length }]
})
mock.onPost('/quality/defects').reply(config => {
  return [201, mutations.logDefect(JSON.parse(config.data))]
})
mock.onPatch(/\/quality\/defects\/[\w-]+\/disposition/).reply(config => {
  const id = config.url!.split('/').slice(-2, -1)[0]
  const { disposition } = JSON.parse(config.data)
  return [200, mutations.setDefectDisposition(id, disposition)]
})
mock.onGet('/quality/stats').reply(() => [200, {
  totalDefects: db.defects.length,
  scrapCount: db.defects.filter(d => d.disposition === 'scrap').length,
  reworkCount: db.defects.filter(d => d.disposition === 'rework').length,
  scrapCost: db.defects.filter(d => d.disposition === 'scrap').reduce((s, d) => s + (d.cost ?? 0), 0),
  totalCost: db.defects.reduce((s, d) => s + (d.cost ?? 0), 0),
}])

// Inventory
mock.onGet('/inventory/parts').reply(config => {
  const p = config.params as any
  let list = [...db.parts]
  if (p?.status && p.status !== 'all') list = list.filter(pt => pt.status === p.status)
  if (p?.search) list = list.filter(pt => pt.partNumber.toLowerCase().includes(p.search.toLowerCase()) || pt.description.toLowerCase().includes(p.search.toLowerCase()))
  return [200, { data: list, total: list.length }]
})
mock.onPost('/inventory/parts').reply(config => {
  return [201, mutations.addPart(JSON.parse(config.data))]
})
mock.onGet('/inventory/alerts').reply(() => [200, db.parts.filter(p => p.status !== 'ok')])
mock.onPatch(/\/inventory\/parts\/[\w-]+\/adjust/).reply(config => {
  const id = config.url!.split('/').slice(-2, -1)[0]
  const { qty } = JSON.parse(config.data)
  return [200, mutations.adjustStock(id, qty)]
})

// Users
mock.onGet('/users').reply(() => [200, [...db.users]])
mock.onPost('/users').reply(config => [201, mutations.addUser(JSON.parse(config.data))])
mock.onPatch(/\/users\/[\w-]+/).reply(config => {
  const id = config.url!.split('/').pop()!
  return [200, mutations.updateUser(id, JSON.parse(config.data))]
})
mock.onGet(/\/users\/[\w-]+/).reply(config => {
  const id = config.url!.split('/').pop()
  return [200, db.users.find(u => u.id === id) ?? db.users[0]]
})

export default api
