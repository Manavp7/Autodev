import type {
  User, ProductionLine, Station, WorkOrder, AndonEvent,
  PlantKpi, Breakdown, Defect, SparePart
} from '../types/index'

// --- Users --------------------------------------------------------------------

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe',    email: 'john.doe@automfg.com',   role: 'plant_manager', badgeId: '100492', plant: 'Detroit-04', avatarInitials: 'JD', isActive: true },
  { id: 'u2', name: 'Alice Smith', email: 'alice.smith@automfg.com', role: 'operator',      badgeId: '102944', plant: 'Detroit-04', avatarInitials: 'AS', isActive: true },
  { id: 'u3', name: 'Mike Kim',    email: 'mike.kim@automfg.com',    role: 'maintenance',   badgeId: '109201', plant: 'Detroit-04', avatarInitials: 'MK', isActive: true },
  { id: 'u4', name: 'Maria Rossi', email: 'm.rossi@automfg.com',     role: 'quality',       badgeId: '110482', plant: 'Detroit-04', avatarInitials: 'MR', isActive: true },
  { id: 'u5', name: 'Dan Torres',  email: 'd.torres@automfg.com',    role: 'supervisor',    badgeId: '112033', plant: 'Detroit-04', avatarInitials: 'DT', isActive: false },
  { id: 'u6', name: 'Sarah Chen',  email: 's.chen@automfg.com',      role: 'quality',       badgeId: '113402', plant: 'Detroit-04', avatarInitials: 'SC', isActive: true },
  { id: 'u7', name: 'Admin User',  email: 'admin@automfg.com',       role: 'admin',         badgeId: 'ADM-001', plant: 'Detroit-04', avatarInitials: 'AU', isActive: true },
]

export const mockUser = MOCK_USERS[6] // admin@automfg.com

// --- KPIs ---------------------------------------------------------------------

export const mockKpi: PlantKpi = {
  planActual: 1402, planTarget: 1500,
  oee: 82.4, oeeTarget: 85,
  andonEventsToday: 14,
  activeBreakdowns: 3, linesStopped: 2,
}

// --- Production Lines ---------------------------------------------------------

export const mockLines: ProductionLine[] = [
  { id: 'l1', name: 'Assembly A1', category: 'Chassis', status: 'running', currentWo: 'WO-44921-X', taktActual: 42, taktTarget: 45, outputActual: 340, outputTarget: 350, oee: 97 },
  { id: 'l2', name: 'Paint Line B', category: 'Body', status: 'stopped', currentWo: 'WO-44922-Y', taktActual: 0, taktTarget: 120, outputActual: 112, outputTarget: 150, oee: 74, faultDescription: 'Robot Arm Fault (Station 4)', downtimeMinutes: 42 },
  { id: 'l3', name: 'Trim Line C', category: 'Interior', status: 'delayed', currentWo: 'WO-44923-Z', taktActual: 48, taktTarget: 45, outputActual: 290, outputTarget: 350, oee: 82 },
  { id: 'l4', name: 'Engine Marriage', category: 'Powertrain', status: 'running', currentWo: 'WO-44924-A', taktActual: 44, taktTarget: 45, outputActual: 345, outputTarget: 350, oee: 98 },
  { id: 'l5', name: 'Assembly A2', category: 'Chassis', status: 'running', currentWo: 'WO-44925-B', taktActual: 45, taktTarget: 45, outputActual: 350, outputTarget: 350, oee: 99 },
  { id: 'l6', name: 'Paint Line A', category: 'Body', status: 'running', currentWo: 'WO-44926-C', taktActual: 115, taktTarget: 120, outputActual: 155, outputTarget: 150, oee: 95 },
  { id: 'l7', name: 'Trim Line A', category: 'Interior', status: 'running', currentWo: 'WO-44927-D', taktActual: 44, taktTarget: 45, outputActual: 345, outputTarget: 350, oee: 96 },
  { id: 'l8', name: 'Engine Sub-Assembly', category: 'Powertrain', status: 'delayed', currentWo: 'WO-44928-E', taktActual: 50, taktTarget: 45, outputActual: 280, outputTarget: 350, oee: 80 },
  { id: 'l9', name: 'Chassis Sub-Assembly', category: 'Chassis', status: 'stopped', currentWo: 'WO-44929-F', taktActual: 0, taktTarget: 60, outputActual: 100, outputTarget: 200, oee: 65, faultDescription: 'Material Shortage', downtimeMinutes: 120 },
  { id: 'l10', name: 'Stamping Line', category: 'Body', status: 'running', currentWo: 'WO-44930-G', taktActual: 30, taktTarget: 35, outputActual: 450, outputTarget: 400, oee: 100 },
  { id: 'l11', name: 'Electronics Testing', category: 'Interior', status: 'running', currentWo: 'WO-44931-H', taktActual: 20, taktTarget: 22, outputActual: 600, outputTarget: 600, oee: 98 },
  { id: 'l12', name: 'Battery Marriage', category: 'Powertrain', status: 'delayed', currentWo: 'WO-44932-I', taktActual: 90, taktTarget: 80, outputActual: 180, outputTarget: 200, oee: 85 },
]

// --- Stations -----------------------------------------------------------------

export const mockStations: Station[] = [
  { id: 's1', lineId: 'l1', name: 'STN-010', process: 'Harness Routing', status: 'running', taktActual: 42, taktTarget: 45, operatorId: 'OP-4921', lastSignoff: '10:42 AM' },
  { id: 's2', lineId: 'l1', name: 'STN-020', process: 'Engine Drop', status: 'running', taktActual: 44, taktTarget: 45, operatorId: 'OP-8812', lastSignoff: '10:43 AM' },
  { id: 's3', lineId: 'l1', name: 'STN-030', process: 'Transmission Mount', status: 'delayed', taktActual: 59, taktTarget: 45, operatorId: 'OP-8820', holdReason: 'Hold: QC Check' },
  { id: 's4', lineId: 'l1', name: 'STN-040', process: 'Drive Shaft Install', status: 'starved', taktActual: 0, taktTarget: 45 },
  { id: 's5', lineId: 'l2', name: 'STN-010', process: 'Pre-treatment', status: 'stopped', taktActual: 0, taktTarget: 120 },
  { id: 's6', lineId: 'l3', name: 'STN-010', process: 'Headliner Install', status: 'delayed', taktActual: 47, taktTarget: 45, operatorId: 'OP-3312' },
  { id: 's7', lineId: 'l4', name: 'STN-010', process: 'Engine Mount', status: 'running', taktActual: 43, taktTarget: 45, operatorId: 'OP-5511' },
]

// --- Work Orders --------------------------------------------------------------

export const mockWorkOrders: WorkOrder[] = [
  { id: 'WO-44921-X', partNumber: '1G1YD2E0XN5100', plant: 'Detroit-04', line: 'Assembly A1', operations: ['OP10','OP20','OP30'], stdTime: 2.5, actTime: 2.8, materialStatus: 'shortage', plannedQty: 100, actualQty: 45, status: 'in_progress', targetDate: '2025-10-20', createdAt: '2025-10-16' },
  { id: 'WO-44922-Y', partNumber: 'PT-902A', plant: 'Detroit-04', line: 'Paint Line B', operations: ['OP10','OP40'], stdTime: 1.2, actTime: 0.8, materialStatus: 'ready', plannedQty: 150, actualQty: 12, status: 'released', targetDate: '2025-10-22', createdAt: '2025-10-17' },
  { id: 'WO-44923-Z', partNumber: 'EL-884B', plant: 'Detroit-04', line: 'Trim Line C', operations: ['OP10','OP20'], stdTime: 4.0, actTime: 3.1, materialStatus: 'lowStock', plannedQty: 500, actualQty: 340, status: 'in_progress', targetDate: '2025-10-21', createdAt: '2025-10-15' },
  { id: 'WO-44924-A', partNumber: 'CHG-112-EV', plant: 'Detroit-04', line: 'Engine Marriage', operations: ['OP10'], stdTime: 1.5, materialStatus: 'pending', plannedQty: 200, actualQty: 0, status: 'pending', targetDate: '2025-10-25', createdAt: '2025-10-18' },
  { id: 'WO-44919-R', partNumber: 'MT-550-V8', plant: 'Detroit-04', line: 'Assembly A1', operations: ['OP10','OP20','OP30','OP40'], stdTime: 3.0, actTime: 2.9, materialStatus: 'ready', plannedQty: 80, actualQty: 80, status: 'completed', targetDate: '2025-10-18', createdAt: '2025-10-14' },
  { id: 'WO-44920-Q', partNumber: 'BRAKE-KIT-HD', plant: 'Detroit-04', line: 'Assembly A1', operations: ['OP10'], stdTime: 0.8, materialStatus: 'ready', plannedQty: 300, actualQty: 0, status: 'on_hold', targetDate: '2025-10-24', createdAt: '2025-10-19' },
  { id: 'WO-44925-B', partNumber: 'BAT-110', plant: 'Detroit-04', line: 'Assembly A2', operations: ['OP10','OP20'], stdTime: 1.5, actTime: 1.6, materialStatus: 'ready', plannedQty: 120, actualQty: 60, status: 'in_progress', targetDate: '2025-10-22', createdAt: '2025-10-17' },
  { id: 'WO-44926-C', partNumber: 'INT-TRIM-01', plant: 'Detroit-04', line: 'Trim Line A', operations: ['OP10','OP30'], stdTime: 2.0, actTime: 0, materialStatus: 'lowStock', plannedQty: 400, actualQty: 0, status: 'released', targetDate: '2025-10-23', createdAt: '2025-10-18' },
  { id: 'WO-44927-D', partNumber: 'EXH-SYS-V6', plant: 'Detroit-04', line: 'Chassis Sub-Assembly', operations: ['OP10','OP20'], stdTime: 1.8, actTime: 1.8, materialStatus: 'ready', plannedQty: 250, actualQty: 250, status: 'completed', targetDate: '2025-10-19', createdAt: '2025-10-15' },
  { id: 'WO-44928-E', partNumber: 'DRV-SHAFT-RWD', plant: 'Detroit-04', line: 'Assembly A1', operations: ['OP10'], stdTime: 0.5, actTime: 0.5, materialStatus: 'shortage', plannedQty: 180, actualQty: 20, status: 'on_hold', targetDate: '2025-10-25', createdAt: '2025-10-20' },
  { id: 'WO-44929-F', partNumber: 'PNL-DOOR-FL', plant: 'Detroit-04', line: 'Stamping Line', operations: ['OP10','OP20'], stdTime: 0.2, actTime: 0.2, materialStatus: 'ready', plannedQty: 1000, actualQty: 450, status: 'in_progress', targetDate: '2025-10-21', createdAt: '2025-10-19' },
  { id: 'WO-44930-G', partNumber: 'PNL-DOOR-FR', plant: 'Detroit-04', line: 'Stamping Line', operations: ['OP10','OP20'], stdTime: 0.2, materialStatus: 'pending', plannedQty: 1000, actualQty: 0, status: 'pending', targetDate: '2025-10-22', createdAt: '2025-10-19' },
  { id: 'WO-44931-H', partNumber: 'ECU-MOD-MAIN', plant: 'Detroit-04', line: 'Electronics Testing', operations: ['OP10'], stdTime: 0.8, actTime: 0.85, materialStatus: 'ready', plannedQty: 500, actualQty: 210, status: 'in_progress', targetDate: '2025-10-23', createdAt: '2025-10-20' },
  { id: 'WO-44932-I', partNumber: 'SEAT-FR-L', plant: 'Detroit-04', line: 'Trim Line C', operations: ['OP10','OP20'], stdTime: 1.0, actTime: 0, materialStatus: 'ready', plannedQty: 300, actualQty: 0, status: 'released', targetDate: '2025-10-24', createdAt: '2025-10-21' },
  { id: 'WO-44933-J', partNumber: 'SEAT-FR-R', plant: 'Detroit-04', line: 'Trim Line C', operations: ['OP10','OP20'], stdTime: 1.0, materialStatus: 'pending', plannedQty: 300, actualQty: 0, status: 'pending', targetDate: '2025-10-24', createdAt: '2025-10-21' },
  { id: 'WO-44934-K', partNumber: 'WIRE-HARN-MAIN', plant: 'Detroit-04', line: 'Assembly A2', operations: ['OP10','OP20','OP30'], stdTime: 4.5, actTime: 4.6, materialStatus: 'shortage', plannedQty: 150, actualQty: 45, status: 'in_progress', targetDate: '2025-10-26', createdAt: '2025-10-22' },
  { id: 'WO-44935-L', partNumber: 'WHL-ALLOY-19', plant: 'Detroit-04', line: 'Assembly A1', operations: ['OP10'], stdTime: 0.3, actTime: 0.3, materialStatus: 'ready', plannedQty: 600, actualQty: 600, status: 'completed', targetDate: '2025-10-18', createdAt: '2025-10-16' },
  { id: 'WO-44936-M', partNumber: 'TIRE-245-45-19', plant: 'Detroit-04', line: 'Assembly A1', operations: ['OP10'], stdTime: 0.2, actTime: 0.2, materialStatus: 'ready', plannedQty: 600, actualQty: 600, status: 'completed', targetDate: '2025-10-18', createdAt: '2025-10-16' },
]

// --- Andon Events -------------------------------------------------------------

export const mockAndonEvents: AndonEvent[] = [
  { id: 'AND-9042', lineId: 'l2', stationId: 's5', type: 'fault', status: 'open', priority: 'critical', title: 'Robot Arm Jam - Stn 14', description: 'Robot arm M-4 halted during welding cycle. Error code E-409. Paint line fully stopped.', raisedBy: 'J. Smith', assignedTo: 'Mike Kim', raisedAt: new Date(Date.now() - 72 * 60000).toISOString(), slaMinutes: 60, slaBreached: true },
  { id: 'AND-9043', lineId: 'l1', stationId: 's4', type: 'shortage', status: 'open', priority: 'high', title: 'Part Shortage - Chassis Stn 4', description: 'Material PT-882-A below minimum at station. Production will starve within 20 minutes.', raisedBy: 'A. Lee', raisedAt: new Date(Date.now() - 15 * 60000).toISOString(), slaMinutes: 20, slaBreached: false },
  { id: 'AND-9044', lineId: 'l2', stationId: 's5', type: 'quality', status: 'open', priority: 'medium', title: 'Paint Defect - Inclusion', description: 'Surface inclusion detected at Station 2 Prime coat. 6 units affected.', raisedBy: 'M. Rossi', raisedAt: new Date(Date.now() - 5 * 60000).toISOString(), slaMinutes: 30, slaBreached: false },
  { id: 'AND-9041', lineId: 'l1', type: 'handover', status: 'resolved', priority: 'low', title: 'Shift A to Shift B Handover', description: 'Shift handover completed successfully. All carry-forward items documented.', raisedBy: 'J. Doe', raisedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 90 * 60000).toISOString(), slaMinutes: 15, slaBreached: false, rootCause: 'Routine handover', actionTaken: 'Shift B acknowledged all carry-forward items.' },
  { id: 'AND-9040', lineId: 'l3', stationId: 's6', type: 'time', status: 'acknowledged', priority: 'medium', title: 'Takt Overrun - Trim STN-010', description: 'Headliner install exceeding takt time by 4s. Ergonomics investigation in progress.', raisedBy: 'D. Torres', assignedTo: 'D. Torres', raisedAt: new Date(Date.now() - 35 * 60000).toISOString(), acknowledgedAt: new Date(Date.now() - 30 * 60000).toISOString(), slaMinutes: 30, slaBreached: false },
  { id: 'AND-9045', lineId: 'l4', stationId: 's7', type: 'quality', status: 'open', priority: 'high', title: 'Engine Mount Defect', description: 'Incorrect torque applied to engine mounts on 3 units.', raisedBy: 'A. Lee', raisedAt: new Date(Date.now() - 10 * 60000).toISOString(), slaMinutes: 30, slaBreached: false },
  { id: 'AND-9046', lineId: 'l1', stationId: 's2', type: 'fault', status: 'open', priority: 'critical', title: 'Conveyor Halt', description: 'Main conveyor belt stalled. Motor fault code E-102.', raisedBy: 'J. Smith', raisedAt: new Date(Date.now() - 65 * 60000).toISOString(), slaMinutes: 60, slaBreached: true },
  { id: 'AND-9047', lineId: 'l3', stationId: 's6', type: 'shortage', status: 'acknowledged', priority: 'medium', title: 'Fastener Shortage', description: 'Low on interior trim clips. Refill requested.', raisedBy: 'D. Torres', assignedTo: 'Mike Kim', raisedAt: new Date(Date.now() - 40 * 60000).toISOString(), acknowledgedAt: new Date(Date.now() - 20 * 60000).toISOString(), slaMinutes: 45, slaBreached: false },
  { id: 'AND-9048', lineId: 'l2', stationId: 's5', type: 'safety', status: 'resolved', priority: 'critical', title: 'Safety Sensor Tripped', description: 'Light curtain broken in paint cell 2. Operator entered zone.', raisedBy: 'M. Rossi', raisedAt: new Date(Date.now() - 120 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 110 * 60000).toISOString(), slaMinutes: 15, slaBreached: false, rootCause: 'Operator error', actionTaken: 'Operator retrained.' },
  { id: 'AND-9049', lineId: 'l4', stationId: 's7', type: 'time', status: 'open', priority: 'low', title: 'Tool Calibration Due', description: 'Torque wrench calibration required by end of shift.', raisedBy: 'A. Lee', raisedAt: new Date(Date.now() - 200 * 60000).toISOString(), slaMinutes: 480, slaBreached: false },
  { id: 'AND-9050', lineId: 'l1', stationId: 's1', type: 'quality', status: 'open', priority: 'high', title: 'Harness Routing Error', description: 'Main wiring harness routed incorrectly on 5 chassis.', raisedBy: 'M. Rossi', raisedAt: new Date(Date.now() - 25 * 60000).toISOString(), slaMinutes: 30, slaBreached: false },
  { id: 'AND-9051', lineId: 'l3', stationId: 's6', type: 'fault', status: 'acknowledged', priority: 'critical', title: 'Hydraulic Leak', description: 'Trim press leaking hydraulic fluid. Containment required.', raisedBy: 'D. Torres', assignedTo: 'Mike Kim', raisedAt: new Date(Date.now() - 50 * 60000).toISOString(), acknowledgedAt: new Date(Date.now() - 45 * 60000).toISOString(), slaMinutes: 60, slaBreached: false },
  { id: 'AND-9052', lineId: 'l2', stationId: 's5', type: 'shortage', status: 'resolved', priority: 'medium', title: 'Primer Low', description: 'Primer tank B at 10% capacity.', raisedBy: 'J. Smith', raisedAt: new Date(Date.now() - 180 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 150 * 60000).toISOString(), slaMinutes: 60, slaBreached: false, rootCause: 'Scheduled refill missed', actionTaken: 'Tank refilled.' },
  { id: 'AND-9053', lineId: 'l4', stationId: 's7', type: 'time', status: 'open', priority: 'high', title: 'Engine Drop Delay', description: 'Overhead crane moving slowly, adding 15s to takt.', raisedBy: 'A. Lee', raisedAt: new Date(Date.now() - 35 * 60000).toISOString(), slaMinutes: 30, slaBreached: true },
  { id: 'AND-9054', lineId: 'l1', stationId: 's3', type: 'safety', status: 'open', priority: 'critical', title: 'Spill Hazard', description: 'Coolant spill near station 3. Cleanup crew needed immediately.', raisedBy: 'J. Doe', raisedAt: new Date(Date.now() - 5 * 60000).toISOString(), slaMinutes: 15, slaBreached: false },
]

// --- Breakdowns ---------------------------------------------------------------

export const mockBreakdowns: Breakdown[] = [
  { id: 'TKT-8992', machineId: 'MCH-1042', machineName: 'CNC-Mill-04', location: 'Line 1, Cell A', priority: 'p1', status: 'in_progress', title: 'CNC-Mill-04 Spindle Overheat', faultCode: 'E-044', description: 'Spindle motor thermal trip. Coolant system suspected. Temperature reached 210Â°C vs 150Â°C limit.', reportedBy: 'J. Smith', assignedTo: 'Mike Kim', reportedAt: new Date(Date.now() - 72 * 60000).toISOString(), slaBreached: true, downtimeMinutes: 72, partsRequired: [{ partNumber: 'PUMP-V2', description: 'Coolant Pump Assembly', qty: 1, onHand: 0 }, { partNumber: 'FILT-09', description: 'In-line filter 10 micron', qty: 2, onHand: 1 }] },
  { id: 'TKT-8993', machineId: 'MCH-1051', machineName: 'Press Line B', location: 'Press Bay 2', priority: 'p2', status: 'open', title: 'Hydraulic Pressure Drop', description: 'System pressure dropping below 80 bar threshold. Likely seal failure on cylinder B12.', reportedBy: 'A. Lee', reportedAt: new Date(Date.now() - 60 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 60, partsRequired: [{ partNumber: 'SEAL-HYD-8', description: 'Hydraulic Seal Kit', qty: 1, onHand: 3 }] },
  { id: 'TKT-8994', machineId: 'MCH-1060', machineName: 'Conveyor A', location: 'Assembly Floor', priority: 'p3', status: 'open', title: 'Belt Tension Loose', description: 'Conveyor belt slipping on return roller. Moderate; production not impacted but monitor closely.', reportedBy: 'M. Kim', reportedAt: new Date(Date.now() - 30 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 0, partsRequired: [] },
  { id: 'TKT-8991', machineId: 'MCH-2001', machineName: 'Paint-Robot-P1', location: 'Paint Bay 1', priority: 'p2', status: 'resolved', title: 'Robot Calibration Drift', description: 'Spray pattern offset detected during quality check. Recalibration completed successfully.', reportedBy: 'M. Rossi', assignedTo: 'Mike Kim', reportedAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 90 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 150, partsRequired: [] },
  { id: 'TKT-8995', machineId: 'MCH-1070', machineName: 'Weld-Bot-W3', location: 'Body Shop', priority: 'p1', status: 'open', title: 'Weld Wire Jam', description: 'Wire feeder jammed. Torch tip damaged.', reportedBy: 'J. Smith', reportedAt: new Date(Date.now() - 15 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 15, partsRequired: [{ partNumber: 'WELD-TIP-08', description: 'Welding Contact Tip 0.8mm', qty: 2, onHand: 50 }] },
  { id: 'TKT-8996', machineId: 'MCH-1082', machineName: 'Oven-Curing-1', location: 'Paint Bay 2', priority: 'p1', status: 'in_progress', title: 'Temperature Fluctuation', description: 'Zone 3 temperature dropping below 140Â°C. Suspect faulty heating element.', reportedBy: 'A. Lee', assignedTo: 'Mike Kim', reportedAt: new Date(Date.now() - 120 * 60000).toISOString(), slaBreached: true, downtimeMinutes: 120, partsRequired: [{ partNumber: 'HEAT-ELEM-2KW', description: 'Heating Element 2kW', qty: 1, onHand: 2 }] },
  { id: 'TKT-8997', machineId: 'MCH-1090', machineName: 'AGV-Fleet-Lead', location: 'Assembly Floor', priority: 'p2', status: 'resolved', title: 'Navigation Error', description: 'AGV lost path near station 4. Rebooted and path reset.', reportedBy: 'M. Rossi', assignedTo: 'Mike Kim', reportedAt: new Date(Date.now() - 300 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 250 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 50, partsRequired: [] },
  { id: 'TKT-8998', machineId: 'MCH-1105', machineName: 'Leak-Tester-End', location: 'EOL Testing', priority: 'p2', status: 'open', title: 'Calibration Failed', description: 'Daily calibration check failed. Master leak standard not detected.', reportedBy: 'A. Lee', reportedAt: new Date(Date.now() - 45 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 45, partsRequired: [] },
  { id: 'TKT-8999', machineId: 'MCH-1120', machineName: 'Torque-Gun-M4', location: 'Trim Line C', priority: 'p3', status: 'in_progress', title: 'Battery Degradation', description: 'Tool battery life significantly reduced. Swapping battery packs frequently.', reportedBy: 'D. Torres', assignedTo: 'J. Doe', reportedAt: new Date(Date.now() - 400 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 0, partsRequired: [{ partNumber: 'BATT-18V-LI', description: '18V Lithium Ion Tool Battery', qty: 2, onHand: 1 }] },
  { id: 'TKT-9000', machineId: 'MCH-1150', machineName: 'Hoist-Overhead-3', location: 'Engine Marriage', priority: 'p1', status: 'resolved', title: 'Pendant Control Unresponsive', description: 'Up/Down buttons on pendant intermittently failing.', reportedBy: 'J. Smith', assignedTo: 'Mike Kim', reportedAt: new Date(Date.now() - 600 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 500 * 60000).toISOString(), slaBreached: true, downtimeMinutes: 100, partsRequired: [{ partNumber: 'CTRL-PEND-4B', description: '4-Button Crane Pendant', qty: 1, onHand: 0 }] },
  { id: 'TKT-9001', machineId: 'MCH-1180', machineName: 'Vision-Inspect-Cam', location: 'Quality Gate', priority: 'p2', status: 'open', title: 'Lens Obscured', description: 'Camera lens covered in mist/oil. False rejects occurring.', reportedBy: 'M. Rossi', reportedAt: new Date(Date.now() - 20 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 20, partsRequired: [] },
  { id: 'TKT-9002', machineId: 'MCH-1200', machineName: 'HVAC-Rooftop-4', location: 'Facility', priority: 'p3', status: 'open', title: 'Vibration/Noise', description: 'Loud rattling from AC unit above Stamping Line.', reportedBy: 'M. Kim', reportedAt: new Date(Date.now() - 1000 * 60000).toISOString(), slaBreached: false, downtimeMinutes: 0, partsRequired: [] },
]

// --- Defects ------------------------------------------------------------------

export const mockDefects: Defect[] = [
  { id: 'D-8823', partNumber: 'PT-902A', stationId: 'Stamping Line', defectType: 'Surface Scratch', qty: 1, disposition: 'scrap', loggedBy: 'M. Rossi', loggedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), cost: 320, woId: 'WO-44922-Y' },
  { id: 'D-8824', partNumber: '1G1YD2E0XN5100', stationId: 'Paint Cell 2', defectType: 'Paint Inclusion', qty: 1, disposition: 'rework', loggedBy: 'M. Rossi', loggedAt: new Date(Date.now() - 90 * 60000).toISOString(), cost: 85, woId: 'WO-44921-X' },
  { id: 'D-8825', partNumber: 'BAT-110', stationId: 'Sub-Assy B', defectType: 'Dimensional Variance', qty: 12, disposition: 'uai', loggedBy: 'A. Smith', loggedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(), cost: 1200, woId: 'WO-44923-Z' },
  { id: 'D-8826', partNumber: 'EL-884B', stationId: 'STN-020', defectType: 'Missing Torque Spec', qty: 2, disposition: 'pending', loggedBy: 'A. Smith', loggedAt: new Date(Date.now() - 60 * 60000).toISOString(), cost: 450, woId: 'WO-44923-Z' },
]

// --- Spare Parts --------------------------------------------------------------

export const mockParts: SparePart[] = [
  { id: 'sp1', partNumber: 'PUMP-V2-ASSY', description: 'Coolant Pump Assembly (CNC)', category: 'Mechanical', location: 'Whse A - Bin 42', onHand: 0, minLevel: 2, maxLevel: 5, unitCost: 1200, status: 'stockout' },
  { id: 'sp2', partNumber: 'SENS-PROX-8M', description: 'Proximity Sensor 8mm PNP', category: 'Electrical', location: 'Whse B - Rack 12', onHand: 4, minLevel: 10, maxLevel: 30, unitCost: 45, status: 'reorder' },
  { id: 'sp3', partNumber: 'FILT-OIL-10M', description: 'Hydraulic Oil Filter 10 Micron', category: 'Consumables', location: 'Whse A - Bin 15', onHand: 42, minLevel: 15, maxLevel: 60, unitCost: 22, status: 'ok' },
  { id: 'sp4', partNumber: 'SEAL-HYD-8', description: 'Hydraulic Seal Kit', category: 'Mechanical', location: 'Whse A - Bin 08', onHand: 3, minLevel: 5, maxLevel: 15, unitCost: 380, status: 'reorder' },
  { id: 'sp5', partNumber: 'BELT-CVY-A2', description: 'Conveyor Belt Assembly A2', category: 'Mechanical', location: 'Whse C - Bay 3', onHand: 2, minLevel: 1, maxLevel: 3, unitCost: 750, status: 'ok' },
  { id: 'sp6', partNumber: 'FUSE-32A-HRC', description: 'HRC Fuse 32A Ceramic', category: 'Electrical', location: 'Whse B - Rack 4', onHand: 85, minLevel: 20, maxLevel: 100, unitCost: 8, status: 'ok' },
  { id: 'sp7', partNumber: 'MTR-SERVO-3KW', description: 'Servo Motor 3kW AC', category: 'Electrical', location: 'Whse B - Rack 9', onHand: 0, minLevel: 1, maxLevel: 2, unitCost: 2800, status: 'stockout' },
  { id: 'sp8', partNumber: 'BEAR-FAG-6205', description: 'FAG Deep Groove Bearing 6205', category: 'Mechanical', location: 'Whse A - Bin 22', onHand: 24, minLevel: 10, maxLevel: 50, unitCost: 18, status: 'ok' },
]
