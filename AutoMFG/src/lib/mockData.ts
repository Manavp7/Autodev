import type {
  User, Plant, ProductionLine, Station, WorkOrder,
  AndonEvent, PlantKpi, Breakdown, Defect, SparePart
} from '../types'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'u1', name: 'John Doe', email: 'john.doe@automfg.com',
    role: 'plant_manager', badgeId: '100492', plant: 'Detroit-04', avatarInitials: 'JD',
  },
  {
    id: 'u2', name: 'Alice Smith', email: 'alice.smith@automfg.com',
    role: 'operator', badgeId: '102944', plant: 'Detroit-04', avatarInitials: 'AS',
  },
  {
    id: 'u3', name: 'Mike Kim', email: 'mike.kim@automfg.com',
    role: 'maintenance', badgeId: '109201', plant: 'Detroit-04', avatarInitials: 'MK',
  },
  {
    id: 'u4', name: 'Maria Rossi', email: 'm.rossi@automfg.com',
    role: 'quality', badgeId: '110482', plant: 'Detroit-04', avatarInitials: 'MR',
  },
]

export const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock'

// ─── Plant ────────────────────────────────────────────────────────────────────

export const MOCK_PLANT: Plant = {
  id: 'p1', name: 'Plant Detroit-04', code: 'DTW-04', timezone: 'America/Detroit',
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const MOCK_KPI: PlantKpi = {
  planActual: 1402, planTarget: 1500,
  oee: 82.4, oeeTarget: 85,
  andonEventsToday: 14,
  activeBreakdowns: 2, linesStopped: 2,
}

// ─── Production Lines ─────────────────────────────────────────────────────────

export const MOCK_LINES: ProductionLine[] = [
  {
    id: 'l1', name: 'Assembly A1', category: 'Chassis',
    status: 'running', currentWo: 'WO-8823',
    taktActual: 42, taktTarget: 45,
    outputActual: 340, outputTarget: 350, oee: 97,
  },
  {
    id: 'l2', name: 'Paint Line B', category: 'Body',
    status: 'stopped', currentWo: 'WO-8824',
    taktActual: 0, taktTarget: 120,
    outputActual: 112, outputTarget: 150, oee: 74,
    faultDescription: 'Robot Arm Fault (Station 4)', downtimeMinutes: 12,
  },
  {
    id: 'l3', name: 'Trim Line C', category: 'Interior',
    status: 'delayed', currentWo: 'WO-8825',
    taktActual: 48, taktTarget: 45,
    outputActual: 290, outputTarget: 350, oee: 82,
  },
  {
    id: 'l4', name: 'Engine Marriage', category: 'Powertrain',
    status: 'running', currentWo: 'WO-8826',
    taktActual: 44, taktTarget: 45,
    outputActual: 345, outputTarget: 350, oee: 98,
  },
]

// ─── Stations ─────────────────────────────────────────────────────────────────

export const MOCK_STATIONS: Station[] = [
  { id: 's1', lineId: 'l1', name: 'STN-010', process: 'Harness Routing', status: 'running', taktActual: 42, taktTarget: 45, operatorId: 'OP-4921', lastSignoff: '10:42 AM' },
  { id: 's2', lineId: 'l1', name: 'STN-020', process: 'Engine Drop', status: 'running', taktActual: 44, taktTarget: 45, operatorId: 'OP-8812', lastSignoff: '10:43 AM' },
  { id: 's3', lineId: 'l1', name: 'STN-030', process: 'Transmission Mount', status: 'delayed', taktActual: 59, taktTarget: 45, operatorId: 'OP-8820', holdReason: 'Hold: QC Check' },
  { id: 's4', lineId: 'l1', name: 'STN-040', process: 'Drive Shaft Install', status: 'starved', taktActual: 0, taktTarget: 45 },
]

// ─── Work Orders ──────────────────────────────────────────────────────────────

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-44921-X', partNumber: '1G1YD2E0XN5100', plant: 'Detroit-04', line: 'ASM-Line-4',
    operations: ['10', '20', '30'], stdTime: 2.5, actTime: 2.8,
    materialStatus: 'shortage', plannedQty: 100, actualQty: 45,
    status: 'in_progress', targetDate: '2023-10-20', createdAt: '2023-10-16',
  },
  {
    id: 'WO-44922-Y', partNumber: 'PT-902A', plant: 'Detroit-04', line: 'Paint-Line-1',
    operations: ['10', '40'], stdTime: 1.2, actTime: 0.8,
    materialStatus: 'ready', plannedQty: 150, actualQty: 12,
    status: 'released', targetDate: '2023-10-22', createdAt: '2023-10-17',
  },
  {
    id: 'WO-44923-Z', partNumber: 'EL-884B', plant: 'Detroit-04', line: 'Sub-Assy-2',
    operations: ['10', '20'], stdTime: 4.0, actTime: 3.1,
    materialStatus: 'lowStock', plannedQty: 500, actualQty: 340,
    status: 'in_progress', targetDate: '2023-10-21', createdAt: '2023-10-15',
  },
  {
    id: 'WO-44924-A', partNumber: 'CHG-112-EV', plant: 'Detroit-04', line: 'ASM-Line-4',
    operations: ['10'], stdTime: 1.5, actTime: undefined,
    materialStatus: 'pending', plannedQty: 200, actualQty: 0,
    status: 'pending', targetDate: '2023-10-25', createdAt: '2023-10-18',
  },
]

// ─── Andon Events ─────────────────────────────────────────────────────────────

export const MOCK_ANDON_EVENTS: AndonEvent[] = [
  {
    id: 'AND-9042', lineId: 'l2', stationId: 's3',
    type: 'fault', status: 'open', priority: 'critical',
    title: 'Robot Arm Jam - Stn 14', description: 'Robot arm M-4 halted during welding cycle. Error code E-409.',
    raisedBy: 'J. Smith', assignedTo: 'Mike Kim',
    raisedAt: new Date(Date.now() - 72 * 60000).toISOString(),
    slaMinutes: 60, slaBreached: true,
  },
  {
    id: 'AND-9043', lineId: 'l1', stationId: 's4',
    type: 'shortage', status: 'open', priority: 'high',
    title: 'Part Shortage - Chassis Stn 4', description: 'Material PT-882-A below minimum at station.',
    raisedBy: 'A. Lee',
    raisedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    slaMinutes: 20, slaBreached: false,
  },
  {
    id: 'AND-9044', lineId: 'l2', stationId: 's2',
    type: 'quality', status: 'open', priority: 'medium',
    title: 'Paint Defect - Inclusion', description: 'Surface inclusion detected at Station 2 Prime coat.',
    raisedBy: 'M. Rossi',
    raisedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    slaMinutes: 30, slaBreached: false,
  },
  {
    id: 'AND-9041', lineId: 'l1',
    type: 'handover', status: 'resolved', priority: 'low',
    title: 'Shift A to Shift B Handover', description: 'Shift handover completed successfully.',
    raisedBy: 'J. Doe',
    raisedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    resolvedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    slaMinutes: 15, slaBreached: false,
    rootCause: 'Routine handover', actionTaken: 'Shift B acknowledged all carry-forward items.',
  },
]

// ─── Breakdowns ───────────────────────────────────────────────────────────────

export const MOCK_BREAKDOWNS: Breakdown[] = [
  {
    id: 'TKT-8992', machineId: 'MCH-1042', machineName: 'CNC-Mill-04', location: 'Line 1, Cell A',
    priority: 'p1', status: 'in_progress',
    title: 'CNC-Mill-04 Spindle Overheat', faultCode: 'E-044',
    description: 'Spindle motor thermal trip. Coolant system suspected.',
    reportedBy: 'J. Smith', assignedTo: 'Mike Kim',
    reportedAt: new Date(Date.now() - 72 * 60000).toISOString(),
    slaBreached: true, downtimeMinutes: 72,
    partsRequired: [
      { partNumber: 'PUMP-V2', description: 'Coolant Pump Assembly', qty: 1, onHand: 12 },
      { partNumber: 'FILT-09', description: 'In-line filter 10 micron', qty: 2, onHand: 1 },
    ],
  },
  {
    id: 'TKT-8993', machineId: 'MCH-1051', machineName: 'Press Line B', location: 'Press Bay 2',
    priority: 'p2', status: 'open',
    title: 'Hydraulic Pressure Drop', description: 'System pressure below 80 bar threshold.',
    reportedBy: 'A. Lee',
    reportedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    slaBreached: false, downtimeMinutes: 60,
    partsRequired: [
      { partNumber: 'SEAL-HYD-8', description: 'Hydraulic Seal Kit', qty: 1, onHand: 3 },
    ],
  },
  {
    id: 'TKT-8994', machineId: 'MCH-1060', machineName: 'Conveyor A', location: 'Assembly Floor',
    priority: 'p3', status: 'open',
    title: 'Belt Tension Loose', description: 'Conveyor belt slipping on return roller.',
    reportedBy: 'M. Kim',
    reportedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    slaBreached: false, downtimeMinutes: 30,
    partsRequired: [],
  },
]

// ─── Defects ──────────────────────────────────────────────────────────────────

export const MOCK_DEFECTS: Defect[] = [
  {
    id: 'D-8823', partNumber: 'PT-902A', stationId: 'Stamping Line',
    defectType: 'Surface Scratch', qty: 1, disposition: 'scrap',
    loggedBy: 'M. Rossi', loggedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    cost: 320, woId: 'WO-44922-Y',
  },
  {
    id: 'D-8824', partNumber: '1G1YD2E0XN5100', stationId: 'Paint Cell 2',
    defectType: 'Paint Inclusion', qty: 1, disposition: 'rework',
    loggedBy: 'M. Rossi', loggedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    cost: 85, woId: 'WO-44921-X',
  },
  {
    id: 'D-8825', partNumber: 'BAT-110', stationId: 'Sub-Assy B',
    defectType: 'Dimensional Variance', qty: 12, disposition: 'uai',
    loggedBy: 'A. Smith', loggedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    cost: 1200, woId: 'WO-44923-Z',
  },
]

// ─── Spare Parts ──────────────────────────────────────────────────────────────

export const MOCK_SPARE_PARTS: SparePart[] = [
  {
    id: 'sp1', partNumber: 'PUMP-V2-ASSY', description: 'Coolant Pump Assembly (CNC)',
    category: 'Mechanical', location: 'Whse A - Bin 42',
    onHand: 0, minLevel: 2, unitCost: 1200, status: 'stockout',
  },
  {
    id: 'sp2', partNumber: 'SENS-PROX-8M', description: 'Proximity Sensor 8mm PNP',
    category: 'Electrical', location: 'Whse B - Rack 12',
    onHand: 4, minLevel: 10, unitCost: 45, status: 'reorder',
  },
  {
    id: 'sp3', partNumber: 'FILT-OIL-10M', description: 'Hydraulic Oil Filter 10 Micron',
    category: 'Consumables', location: 'Whse A - Bin 15',
    onHand: 42, minLevel: 15, unitCost: 22, status: 'ok',
  },
  {
    id: 'sp4', partNumber: 'SEAL-HYD-8', description: 'Hydraulic Seal Kit',
    category: 'Mechanical', location: 'Whse A - Bin 08',
    onHand: 3, minLevel: 5, unitCost: 380, status: 'reorder',
  },
]
