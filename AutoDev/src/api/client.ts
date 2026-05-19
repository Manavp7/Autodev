// Frontend-only HTTP client backed by axios-mock-adapter.
// No real network calls happen — every endpoint is satisfied locally so the
// rest of the app can be written as if a backend exists.

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {
  programs as seedPrograms,
  bom as seedBom,
  ecos as seedEcos,
  tests as seedTests,
  approvals as seedApprovals,
  tasks as seedTasks,
  documents as seedDocs,
  users as seedUsers,
  type Program,
  type BomNode,
  type Eco,
  type Test,
  type Approval,
  type Task,
  type DocItem,
  type UserRecord,
} from '../lib/mockData'
import { findDemoUser } from '../lib/demoUsers'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://mock.local/api',
})

// Single shared in-memory store for the mock adapter to mutate.
const db: {
  programs: Program[]
  bom: BomNode[]
  ecos: Eco[]
  tests: Test[]
  approvals: Approval[]
  tasks: Task[]
  documents: DocItem[]
  users: UserRecord[]
} = {
  programs: [...seedPrograms],
  bom: [...seedBom],
  ecos: [...seedEcos],
  tests: [...seedTests],
  approvals: [...seedApprovals],
  tasks: [...seedTasks],
  documents: [...seedDocs],
  users: [...seedUsers],
}

const json = (body: unknown): [number, unknown] => [200, body]
const created = (body: unknown): [number, unknown] => [201, body]
const notFound = (): [number, unknown] => [404, { error: 'not found' }]
const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`

const mock = new MockAdapter(api, { delayResponse: 250 })

// ---------- Auth ----------
mock.onPost('/auth/login').reply((cfg) => {
  const { username, password } = JSON.parse(cfg.data)
  const found = findDemoUser(username, password)
  if (!found) return [401, { error: 'invalid credentials' }]
  const { username: _u, password: _p, ...session } = found
  return [200, { token: 'mock-jwt', user: session }]
})
mock.onPost('/auth/logout').reply(204)
mock.onGet('/auth/me').reply(() => [200, db.users[0]])

// ---------- Programs ----------
mock.onGet('/programs').reply(() => json(db.programs))
mock.onPost('/programs').reply((cfg) => {
  const payload = JSON.parse(cfg.data) as Partial<Program>
  const program: Program = {
    id: uid('PG'),
    name: payload.name ?? 'Untitled program',
    code: payload.code ?? 'PRG-NEW',
    modelYear: payload.modelYear ?? new Date().getFullYear() + 1,
    platform: payload.platform ?? 'TBD',
    marketSegment: payload.marketSegment ?? 'TBD',
    targetLaunch: payload.targetLaunch ?? '',
    estimatedBudget: payload.estimatedBudget ?? 0,
    riskLevel: (payload.riskLevel as Program['riskLevel']) ?? 'MEDIUM',
    trlLevel: payload.trlLevel ?? 4,
    approverNotes: payload.approverNotes,
    currentGate: 0,
    phase: 'Concept',
    health: 'green',
    openEcos: 0,
    budgetUsedPct: 0,
    team: payload.team,
    integrations: payload.integrations,
    milestones: payload.milestones,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  db.programs.unshift(program)
  return created(program)
})
mock.onGet(/\/programs\/[^/]+$/).reply((cfg) => {
  const id = cfg.url!.split('/').pop()
  const prog = db.programs.find((p) => p.id === id)
  return prog ? json(prog) : notFound()
})
mock.onPost(/\/programs\/[^/]+\/gates\/\d+\/approve/).reply((cfg) => {
  const parts = cfg.url!.split('/')
  const programId = parts[parts.length - 4]
  const gate = Number(parts[parts.length - 2]) as Program['currentGate']
  const idx = db.programs.findIndex((p) => p.id === programId)
  if (idx === -1) return notFound()
  db.programs[idx] = { ...db.programs[idx], currentGate: gate }
  return json(db.programs[idx])
})

// ---------- BOM ----------
mock.onGet(/\/bom\/[^/]+$/).reply((cfg) => {
  const programId = cfg.url!.split('/').pop()
  return json(db.bom.filter((n) => n.programId === programId))
})
mock.onPost(/\/bom\/[^/]+\/release/).reply((cfg) => {
  const programId = cfg.url!.split('/').slice(-2, -1)[0]
  db.bom = db.bom.map((n) =>
    n.programId === programId && n.bomType === 'M' ? { ...n, status: 'Released' } : n
  )
  return json({ programId, released: true })
})

// ---------- ECOs ----------
mock.onGet('/ecos').reply(() => json(db.ecos))
mock.onPost('/ecos').reply((cfg) => {
  const payload = JSON.parse(cfg.data) as Partial<Eco>
  const eco: Eco = {
    id: uid('ECO'),
    crNumber: payload.crNumber ?? uid('CR'),
    title: payload.title ?? 'New Change Request',
    changeType: payload.changeType ?? 'Design',
    priority: payload.priority ?? 'Medium',
    affectedParts: payload.affectedParts ?? [],
    impactSummary: payload.impactSummary ?? '',
    costOfChange: payload.costOfChange ?? 0,
    implementationDate: payload.implementationDate,
    status: 'Submitted',
    votes: [],
    createdAt: new Date().toISOString().slice(0, 10),
  }
  db.ecos.unshift(eco)
  return created(eco)
})
mock.onPost(/\/ecos\/[^/]+\/vote/).reply((cfg) => {
  const id = cfg.url!.split('/').slice(-2, -1)[0]
  const idx = db.ecos.findIndex((e) => e.id === id)
  if (idx === -1) return notFound()
  const vote = JSON.parse(cfg.data) as Eco['votes'][number]
  db.ecos[idx] = {
    ...db.ecos[idx],
    votes: [...(db.ecos[idx].votes ?? []), vote],
    status: 'CFRB',
  }
  return json(db.ecos[idx])
})
mock.onPost(/\/ecos\/[^/]+\/approve/).reply((cfg) => {
  const id = cfg.url!.split('/').slice(-2, -1)[0]
  const idx = db.ecos.findIndex((e) => e.id === id)
  if (idx === -1) return notFound()
  db.ecos[idx] = { ...db.ecos[idx], status: 'Approved', ecoNumber: db.ecos[idx].ecoNumber ?? uid('ECO') }
  return json(db.ecos[idx])
})

// ---------- DVP&R ----------
mock.onGet(/\/dvpr\/[^/]+$/).reply((cfg) => {
  const partId = cfg.url!.split('/').pop()
  return json(db.tests.filter((t) => t.partNumber === partId))
})
mock.onPatch(/\/dvpr\/[^/]+\/tests\/[^/]+$/).reply((cfg) => {
  const parts = cfg.url!.split('/')
  const testId = parts.pop()!
  const idx = db.tests.findIndex((t) => t.id === testId)
  if (idx === -1) return notFound()
  db.tests[idx] = { ...db.tests[idx], ...JSON.parse(cfg.data) }
  return json(db.tests[idx])
})

// ---------- Approvals ----------
mock.onGet('/approvals').reply(() => json(db.approvals))
mock.onPost(/\/approvals\/[^/]+\/decide/).reply((cfg) => {
  const id = cfg.url!.split('/').slice(-2, -1)[0]
  const idx = db.approvals.findIndex((a) => a.id === id)
  if (idx === -1) return notFound()
  const body = JSON.parse(cfg.data) as { decision: Approval['status']; approver: string; signature: string; comment?: string }
  db.approvals[idx] = {
    ...db.approvals[idx],
    status: body.decision,
    decision: { approver: body.approver, decisionAt: new Date().toISOString(), signature: body.signature, comment: body.comment },
  }
  return json(db.approvals[idx])
})

// ---------- Tasks ----------
mock.onGet('/tasks').reply(() => json(db.tasks))
mock.onPatch(/\/tasks\/[^/]+$/).reply((cfg) => {
  const id = cfg.url!.split('/').pop()
  const idx = db.tasks.findIndex((t) => t.id === id)
  if (idx === -1) return notFound()
  db.tasks[idx] = { ...db.tasks[idx], ...JSON.parse(cfg.data) }
  return json(db.tasks[idx])
})
mock.onPost('/tasks').reply((cfg) => {
  const payload = JSON.parse(cfg.data) as Partial<Task>
  const t: Task = {
    id: uid('TS'),
    title: payload.title ?? 'New task',
    description: payload.description,
    module: payload.module ?? 'DEV',
    status: payload.status ?? 'Backlog',
    due: payload.due,
    assignee: payload.assignee,
    programId: payload.programId,
  }
  db.tasks.unshift(t)
  return created(t)
})

// ---------- Documents ----------
mock.onGet('/documents').reply(() => json(db.documents))
mock.onPost('/documents').reply((cfg) => {
  const payload = JSON.parse(cfg.data) as Partial<DocItem>
  const d: DocItem = {
    id: uid('DOC'),
    title: payload.title ?? 'New document',
    type: payload.type ?? 'Specification',
    revision: payload.revision ?? 'A',
    status: 'Draft',
    programId: payload.programId,
  }
  db.documents.unshift(d)
  return created(d)
})

// ---------- Users ----------
mock.onGet('/users').reply(() => json(db.users))
mock.onPost('/users').reply((cfg) => {
  const payload = JSON.parse(cfg.data) as Partial<UserRecord>
  const u: UserRecord = {
    id: uid('U'),
    name: payload.name ?? 'New user',
    email: payload.email ?? 'new@auto-suite.dev',
    role: payload.role ?? 'DESIGN_ENGINEER',
    designation: payload.designation ?? 'Engineer',
    plant: payload.plant,
    active: payload.active ?? true,
    pending: payload.pending ?? false,
  }
  db.users.unshift(u)
  return created(u)
})
mock.onPatch(/\/users\/[^/]+$/).reply((cfg) => {
  const id = cfg.url!.split('/').pop()
  const idx = db.users.findIndex((u) => u.id === id)
  if (idx === -1) return notFound()
  db.users[idx] = { ...db.users[idx], ...JSON.parse(cfg.data) }
  return json(db.users[idx])
})
mock.onDelete(/\/users\/[^/]+$/).reply((cfg) => {
  const id = cfg.url!.split('/').pop()
  db.users = db.users.filter((u) => u.id !== id)
  return [204, undefined]
})

// ---------- Integrations / FX / Misc stubs ----------
mock.onGet('/integrations').reply(() =>
  json([
    { id: 'TC',  name: 'Teamcenter PDM',  status: 'connected',     lastPing: new Date().toISOString() },
    { id: 'WC',  name: 'Windchill PDM',   status: 'disconnected' },
    { id: 'SAP', name: 'SAP ERP',         status: 'connected',     lastPing: new Date().toISOString() },
    { id: 'CAT', name: 'CATIA V5/V6',     status: 'file-bridge' },
    { id: 'NX',  name: 'Siemens NX',      status: 'file-bridge' },
    { id: 'SW',  name: 'SolidWorks',      status: 'file-bridge' },
    { id: 'JIR', name: 'JIRA',            status: 'connected' },
    { id: 'POL', name: 'Polarion',        status: 'disconnected' },
    { id: 'OUT', name: 'MS Outlook',      status: 'connected' },
    { id: 'GCL', name: 'Google Calendar', status: 'connected' },
    { id: 'SHP', name: 'SharePoint',      status: 'webhook' },
    { id: 'CON', name: 'Confluence',      status: 'webhook' },
  ])
)

// PPAP control plan stub for cross-module quality gate
mock.onGet(/\/ppap\/[^/]+\/control-plan/).reply((cfg) => {
  const partNumber = decodeURIComponent(cfg.url!.split('/').slice(-2, -1)[0])
  return json({
    partNumber,
    items: [
      { characteristic: 'Length',    spec: '120.00 ± 0.5 mm',      method: 'CMM',      sampleSize: 5,  frequency: '1/hour' },
      { characteristic: 'Hardness',  spec: '52 ± 2 HRC',           method: 'Rockwell', sampleSize: 3,  frequency: '1/shift' },
      { characteristic: 'Surface',   spec: 'Ra ≤ 1.6 µm',          method: 'Profilometer', sampleSize: 3, frequency: '1/lot' },
    ],
  })
})

mock.onGet('/fx').reply(() =>
  json({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0094, JPY: 1.84 })
)

// Catch-all so unknown calls don’t silently 404 — returns empty payloads.
mock.onAny().reply((cfg) => {
  console.warn('[mock] unhandled', cfg.method?.toUpperCase(), cfg.url)
  return json({})
})

export { db }
export default api
