// Frontend-only seed data for AutoDev. Used by the axios-mock-adapter client.
// Mutators rebind module-level arrays so re-renders see the latest state.

export type GateNum = 0 | 1 | 2 | 3 | 4 | 5

export interface Program {
  id: string
  name: string
  code: string
  modelYear: number
  platform: string
  marketSegment: string
  targetLaunch: string
  estimatedBudget: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  trlLevel: number
  approverNotes?: string
  currentGate: GateNum
  phase: string
  health: 'green' | 'yellow' | 'red'
  openEcos: number
  budgetUsedPct: number
  team?: { lead?: string; programManager?: string; design?: string; validation?: string; quality?: string }
  approvers?: { id: string; name: string; role: string; status: 'pending' | 'approved' | 'rejected' }[]
  milestones?: { id: string; label: string; due: string; gate: GateNum }[]
  integrations?: string[]
  createdAt: string
}

export interface BomNode {
  id: string
  programId: string
  partNumber: string
  description: string
  level: number
  parentId?: string
  bomType: 'E' | 'M'
  revision: string
  qty: number
  uom: string
  material?: string
  supplier?: string
  drawingNumber?: string
  weight?: number
  cost?: number
  status: 'Draft' | 'Under Review' | 'Approved' | 'Released'
}

export interface Eco {
  id: string
  crNumber: string
  ecoNumber?: string
  title: string
  changeType: 'Design' | 'Process' | 'Supplier'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  affectedParts: string[]
  impactSummary: string
  costOfChange: number
  implementationDate?: string
  status: 'Submitted' | 'Impact' | 'CFRB' | 'Approved' | 'Rejected' | 'Implemented'
  votes?: { user: string; decision: 'Approve' | 'Reject' | 'More Info'; comment?: string }[]
  createdAt: string
}

export interface Test {
  id: string
  partNumber: string
  testItem: string
  testMethod: string
  acceptanceCriteria: string
  numSamples: number
  result: 'Pass' | 'Fail' | 'Conditional' | 'Pending'
  responsibleEngineer: string
  completionDate?: string
  signOffStatus: 'Open' | 'Signed' | 'Approved'
}

export interface Approval {
  id: string
  programId: string
  gate: GateNum
  title: string
  requestedBy: string
  sla: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Conditional'
  decision?: { approver: string; decisionAt: string; signature: string; comment?: string }
}

export interface Task {
  id: string
  title: string
  description?: string
  module: 'DEV' | 'MFG' | 'SCM'
  status: 'Backlog' | 'Today' | 'In Progress' | 'Done'
  due?: string
  assignee?: string
  programId?: string
}

export interface DocItem {
  id: string
  title: string
  type: 'Drawing' | 'Specification' | 'Report' | 'Procedure' | 'PPAP'
  revision: string
  status: 'Draft' | 'Published' | 'Archived'
  publishedBy?: string
  publishedAt?: string
  programId?: string
}

export interface UserRecord {
  id: string
  name: string
  email: string
  role: string
  designation: string
  plant?: string
  active: boolean
  pending?: boolean
}

const today = new Date()
const iso = (offsetDays: number) =>
  new Date(today.getTime() + offsetDays * 86_400_000).toISOString().slice(0, 10)

export const programs: Program[] = [
  {
    id: 'PG-2026-001', name: 'Alpha SUV EV',  code: 'ALP-SUV-EV', modelYear: 2027, platform: 'Skateboard EV',
    marketSegment: 'D-segment SUV', targetLaunch: iso(540), estimatedBudget: 480_000_000,
    riskLevel: 'MEDIUM', trlLevel: 6, currentGate: 2, phase: 'Design Validation',
    health: 'yellow', openEcos: 3, budgetUsedPct: 42, createdAt: iso(-180),
    team: { lead: 'Mei Tanaka', programManager: 'David Kim', design: 'Sarah Jenkins', validation: 'Marcus Reid', quality: 'Elena Petrova' },
    integrations: ['Teamcenter', 'SAP ERP', 'CATIA V5'],
    approvers: [
      { id: 'U-002', name: 'Mei Tanaka', role: 'CHIEF_ENGINEER',  status: 'approved' },
      { id: 'U-004', name: 'David Kim',  role: 'PROGRAM_MANAGER', status: 'pending' },
      { id: 'U-005', name: 'Elena Petrova', role: 'QUALITY_ENGINEER', status: 'pending' },
    ],
    milestones: [
      { id: 'M1', label: 'Concept Freeze',  due: iso(-90), gate: 0 },
      { id: 'M2', label: 'Design Freeze',   due: iso(-30), gate: 1 },
      { id: 'M3', label: 'Prototype Build', due: iso(60),  gate: 2 },
      { id: 'M4', label: 'Validation Done', due: iso(180), gate: 3 },
      { id: 'M5', label: 'PPAP Submission', due: iso(360), gate: 4 },
      { id: 'M6', label: 'Production Ramp', due: iso(540), gate: 5 },
    ],
  },
  {
    id: 'PG-2026-002', name: 'Omega Sedan EV', code: 'OMG-SED-EV', modelYear: 2027, platform: 'GA-2',
    marketSegment: 'C-segment Sedan', targetLaunch: iso(420), estimatedBudget: 360_000_000,
    riskLevel: 'LOW', trlLevel: 7, currentGate: 1, phase: 'Design Freeze', health: 'green',
    openEcos: 1, budgetUsedPct: 28, createdAt: iso(-220),
    integrations: ['Windchill', 'SAP ERP'],
  },
  {
    id: 'PG-2026-003', name: 'Delta Pickup', code: 'DLT-PCKP', modelYear: 2026, platform: 'BoF Truck',
    marketSegment: 'Mid-size Truck', targetLaunch: iso(120), estimatedBudget: 220_000_000,
    riskLevel: 'HIGH', trlLevel: 5, currentGate: 3, phase: 'Validation Failures', health: 'red',
    openEcos: 7, budgetUsedPct: 71, createdAt: iso(-300),
  },
  {
    id: 'PG-2026-004', name: 'Sigma Compact', code: 'SGM-CMP', modelYear: 2027, platform: 'GA-2',
    marketSegment: 'B-segment Hatch', targetLaunch: iso(660), estimatedBudget: 180_000_000,
    riskLevel: 'LOW', trlLevel: 6, currentGate: 0, phase: 'Concept', health: 'green',
    openEcos: 0, budgetUsedPct: 8, createdAt: iso(-30),
  },
]

export const bom: BomNode[] = (() => {
  const nodes: BomNode[] = []
  const programId = 'PG-2026-001'
  nodes.push(
    { id: 'B1', programId, partNumber: 'ALP-VEH-0001', description: 'Vehicle Assembly',  level: 0, bomType: 'M', revision: 'A', qty: 1, uom: 'EA', status: 'Released', cost: 28_500, weight: 1850 },
    { id: 'B2', programId, parentId: 'B1', partNumber: 'ALP-PWR-0010', description: 'Powertrain Module', level: 1, bomType: 'M', revision: 'B', qty: 1, uom: 'EA', status: 'Released', supplier: 'Bosch India', cost: 7_200, weight: 320 },
    { id: 'B3', programId, parentId: 'B1', partNumber: 'ALP-BAT-0020', description: 'High-Voltage Battery Pack', level: 1, bomType: 'M', revision: 'C', qty: 1, uom: 'EA', status: 'Approved', supplier: 'TATA AutoComp', cost: 9_800, weight: 480 },
    { id: 'B4', programId, parentId: 'B1', partNumber: 'ALP-CHS-0030', description: 'Chassis Frame', level: 1, bomType: 'E', revision: 'D', qty: 1, uom: 'EA', status: 'Released', cost: 2_800, weight: 540 },
    { id: 'B5', programId, parentId: 'B1', partNumber: 'ALP-INT-0040', description: 'Interior Trim Set', level: 1, bomType: 'M', revision: 'B', qty: 1, uom: 'EA', status: 'Under Review', supplier: 'Motherson Sumi', cost: 3_400, weight: 210 },
    { id: 'B6', programId, parentId: 'B2', partNumber: 'ALP-MTR-0011', description: 'Drive Motor', level: 2, bomType: 'M', revision: 'B', qty: 2, uom: 'EA', status: 'Released', supplier: 'Bosch India', cost: 2_400, weight: 95 },
    { id: 'B7', programId, parentId: 'B2', partNumber: 'ALP-INV-0012', description: 'Inverter', level: 2, bomType: 'M', revision: 'A', qty: 1, uom: 'EA', status: 'Released', supplier: 'Bosch India', cost: 1_400, weight: 22 },
    { id: 'B8', programId, parentId: 'B3', partNumber: 'ALP-CEL-0021', description: 'Cell Module 100Ah', level: 2, bomType: 'M', revision: 'C', qty: 12, uom: 'EA', status: 'Approved', supplier: 'TATA AutoComp', cost: 480, weight: 28 },
  )
  return nodes
})()

export const ecos: Eco[] = [
  {
    id: 'ECO-4092', crNumber: 'CR-2026-0188', ecoNumber: 'ECO-4092', title: 'Battery Thermal Module Update',
    changeType: 'Design', priority: 'High', affectedParts: ['ALP-BAT-0020', 'ALP-CEL-0021'],
    impactSummary: 'Increase coolant flow by 12% to address thermal runaway risk in cell module C.',
    costOfChange: 240_000, implementationDate: iso(45), status: 'CFRB', createdAt: iso(-12),
    votes: [
      { user: 'Mei Tanaka',  decision: 'Approve', comment: 'Aligned with FMEA mitigation' },
      { user: 'Elena Petrova', decision: 'More Info', comment: 'Need updated DVP' },
    ],
  },
  {
    id: 'ECO-4101', crNumber: 'CR-2026-0192', title: 'Door Hinge Material Substitution',
    changeType: 'Supplier', priority: 'Medium', affectedParts: ['ALP-INT-0042'], impactSummary: 'Switch from steel grade A to grade B for cost reduction.',
    costOfChange: -85_000, status: 'Submitted', createdAt: iso(-3),
  },
]

export const tests: Test[] = [
  { id: 'T-001', partNumber: 'ALP-BAT-0020', testItem: 'Thermal Cycling',  testMethod: 'IEC 62660-2', acceptanceCriteria: '500 cycles, no capacity loss > 5%', numSamples: 6,  result: 'Pass',        responsibleEngineer: 'Marcus Reid',   completionDate: iso(-20), signOffStatus: 'Approved' },
  { id: 'T-002', partNumber: 'ALP-BAT-0020', testItem: 'Vibration',         testMethod: 'IEC 62660-2', acceptanceCriteria: '24h sweep 5–200Hz',                  numSamples: 4,  result: 'Pass',        responsibleEngineer: 'Marcus Reid',   completionDate: iso(-15), signOffStatus: 'Signed' },
  { id: 'T-003', partNumber: 'ALP-PWR-0010', testItem: 'Drive-cycle WLTC',  testMethod: 'WLTC Class 3',acceptanceCriteria: 'Range > 480 km',                    numSamples: 2,  result: 'Conditional', responsibleEngineer: 'Marcus Reid',   completionDate: iso(-8),  signOffStatus: 'Open' },
  { id: 'T-004', partNumber: 'ALP-CHS-0030', testItem: 'Crash Front Offset',testMethod: 'FMVSS 208',   acceptanceCriteria: 'HIC < 700, dummy injury Pass',       numSamples: 1,  result: 'Fail',        responsibleEngineer: 'Marcus Reid',   completionDate: iso(-3),  signOffStatus: 'Open' },
  { id: 'T-005', partNumber: 'ALP-VEH-0001', testItem: 'NVH Idle',          testMethod: 'AIS 21',      acceptanceCriteria: 'Cabin SPL < 38 dBA',                numSamples: 3,  result: 'Pending',     responsibleEngineer: 'Elena Petrova', signOffStatus: 'Open' },
]

export const approvals: Approval[] = [
  { id: 'AP-1', programId: 'PG-2026-001', gate: 2, title: 'Gate 2 — Prototype Build Approval', requestedBy: 'David Kim',   sla: iso(2),  status: 'Pending' },
  { id: 'AP-2', programId: 'PG-2026-003', gate: 3, title: 'Gate 3 — Validation Sign-off',     requestedBy: 'Marcus Reid', sla: iso(-1), status: 'Pending' },
  { id: 'AP-3', programId: 'PG-2026-002', gate: 1, title: 'Gate 1 — Design Freeze',           requestedBy: 'Sarah Jenkins',sla: iso(5),  status: 'Pending' },
]

export const tasks: Task[] = [
  { id: 'TS-1', title: 'Sign-off Gate 2 for Alpha SUV EV', module: 'DEV', status: 'Today',       due: iso(2), assignee: 'David Kim',  programId: 'PG-2026-001' },
  { id: 'TS-2', title: 'Review ECO-4092 impact',           module: 'DEV', status: 'In Progress', due: iso(1), assignee: 'Mei Tanaka', programId: 'PG-2026-001' },
  { id: 'TS-3', title: 'Update DVP for thermal test',      module: 'DEV', status: 'Backlog',     due: iso(7), assignee: 'Marcus Reid' },
  { id: 'TS-4', title: 'Publish PPAP package level 3',     module: 'DEV', status: 'Today',       due: iso(0), assignee: 'Elena Petrova' },
  { id: 'TS-5', title: 'Plant 1 OEE review',               module: 'MFG', status: 'Today',       due: iso(0), assignee: 'Hannah Klein' },
  { id: 'TS-6', title: 'Approve PR-2026-0214',             module: 'SCM', status: 'Backlog',     due: iso(3), assignee: 'Anita Verma' },
]

export const documents: DocItem[] = [
  { id: 'DOC-001', title: 'Alpha SUV — Battery Pack Drawing',   type: 'Drawing',   revision: 'C', status: 'Published', publishedBy: 'Priya Shah', publishedAt: iso(-10), programId: 'PG-2026-001' },
  { id: 'DOC-002', title: 'Cell Module C — DFMEA',              type: 'Report',    revision: 'B', status: 'Published', publishedBy: 'Elena Petrova', publishedAt: iso(-7), programId: 'PG-2026-001' },
  { id: 'DOC-003', title: 'Inverter Procurement Spec',           type: 'Specification', revision: 'A', status: 'Draft',     programId: 'PG-2026-001' },
  { id: 'DOC-004', title: 'Crash Test Procedure FMVSS 208',     type: 'Procedure', revision: 'A', status: 'Published', publishedBy: 'Marcus Reid', publishedAt: iso(-30) },
  { id: 'DOC-005', title: 'Bosch India PPAP Level 3 Package',   type: 'PPAP',      revision: 'A', status: 'Published', publishedBy: 'Naomi Chen', publishedAt: iso(-5) },
]

export const users: UserRecord[] = [
  { id: 'U-001', name: 'Alex Rivera',   email: 'alex@auto-suite.dev',   role: 'SYS_ADMIN',          designation: 'System Administrator', active: true },
  { id: 'U-002', name: 'Mei Tanaka',    email: 'mei@auto-suite.dev',    role: 'CHIEF_ENGINEER',     designation: 'Chief Engineer',       active: true },
  { id: 'U-003', name: 'Sarah Jenkins', email: 'sarah@auto-suite.dev',  role: 'DESIGN_ENGINEER',    designation: 'Sr. Design Engineer',  active: true },
  { id: 'U-004', name: 'David Kim',     email: 'david@auto-suite.dev',  role: 'PROGRAM_MANAGER',    designation: 'Program Manager',      active: true },
  { id: 'U-005', name: 'Elena Petrova', email: 'elena@auto-suite.dev',  role: 'QUALITY_ENGINEER',   designation: 'APQP Lead',            active: true },
  { id: 'U-006', name: 'Marcus Reid',   email: 'marcus@auto-suite.dev', role: 'VALIDATION_ENGINEER',designation: 'Validation Engineer',  active: true },
  { id: 'U-007', name: 'Priya Shah',    email: 'priya@auto-suite.dev',  role: 'DOCUMENT_CONTROLLER',designation: 'Document Controller',  active: true },
  { id: 'U-008', name: 'Liam Chen',     email: 'liam@auto-suite.dev',   role: 'DESIGN_ENGINEER',    designation: 'Junior Design Eng',    active: false, pending: true },
]
