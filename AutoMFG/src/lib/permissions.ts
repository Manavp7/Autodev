// Single-source permissions matrix derived from PRD §4 of all three modules.
// SYS_ADMIN bypasses all checks. Use can(role, action) wherever a guarded
// button / route lives.

import type { Role } from '../stores/authStore'

export type Action =
  // -------- R&D (PRD-01) --------
  | 'APPROVE_GATE'
  | 'SUBMIT_ECO'
  | 'APPROVE_ECO'
  | 'PUBLISH_DOCUMENT'
  | 'INITIATE_PPAP'
  | 'LOG_TEST_RESULT'
  | 'MANAGE_TIMELINE'
  | 'APPROVE_DVPR'
  | 'RELEASE_DESIGN_FREEZE'
  | 'MANAGE_USERS'
  | 'VIEW_ANALYTICS'
  // -------- Manufacturing (PRD-02) --------
  | 'APPROVE_PLAN'
  | 'RELEASE_WO'
  | 'RAISE_ANDON'
  | 'ACK_ANDON'
  | 'RESOLVE_ANDON'
  | 'LOG_DEFECT'
  | 'DISPOSITION_DEFECT'
  | 'APPROVE_UAI'
  | 'CLOSE_BREAKDOWN'
  | 'SIGN_HANDOVER'
  | 'EOL_CERTIFY'
  // -------- Supply chain (PRD-03) --------
  | 'APPROVE_PR_L1'
  | 'APPROVE_PR_L2'
  | 'APPROVE_PR_L3'
  | 'CREATE_RFQ'
  | 'AWARD_RFQ'
  | 'CREATE_PO'
  | 'EXPEDITE_PO'
  | 'APPROVE_AIR_FREIGHT'
  | 'IQC_GRN'
  | 'PROCESS_PAYMENT'
  | 'ONBOARD_SUPPLIER'
  | 'SUSPEND_SUPPLIER'
  | 'APPROVE_CONTRACT'

const matrix: Record<Action, Role[]> = {
  // ---- R&D ----
  APPROVE_GATE:           ['CHIEF_ENGINEER', 'PROGRAM_MANAGER'],
  SUBMIT_ECO:             ['DESIGN_ENGINEER', 'VALIDATION_ENGINEER', 'QUALITY_ENGINEER', 'SUPPLIER_ENGINEER'],
  APPROVE_ECO:            ['CHIEF_ENGINEER', 'PROGRAM_MANAGER', 'QUALITY_ENGINEER'],
  PUBLISH_DOCUMENT:       ['DOCUMENT_CONTROLLER'],
  INITIATE_PPAP:          ['QUALITY_ENGINEER', 'SUPPLIER_QUALITY_ENGINEER'],
  LOG_TEST_RESULT:        ['VALIDATION_ENGINEER', 'QUALITY_ENGINEER'],
  MANAGE_TIMELINE:        ['PROGRAM_MANAGER'],
  APPROVE_DVPR:           ['CHIEF_ENGINEER', 'QUALITY_ENGINEER'],
  RELEASE_DESIGN_FREEZE:  ['CHIEF_ENGINEER'],
  MANAGE_USERS:           [],
  VIEW_ANALYTICS:         ['CHIEF_ENGINEER', 'PROGRAM_MANAGER', 'PLANT_MANAGER', 'CPO'],
  // ---- Manufacturing ----
  APPROVE_PLAN:           ['PRODUCTION_MANAGER', 'PLANT_MANAGER'],
  RELEASE_WO:             ['PRODUCTION_MANAGER', 'SHIFT_SUPERVISOR'],
  RAISE_ANDON:            ['LINE_LEADER', 'MACHINE_OPERATOR', 'SHIFT_SUPERVISOR'],
  ACK_ANDON:              ['LINE_LEADER', 'SHIFT_SUPERVISOR'],
  RESOLVE_ANDON:          ['LINE_LEADER', 'SHIFT_SUPERVISOR', 'MAINTENANCE_TECH'],
  LOG_DEFECT:             ['MACHINE_OPERATOR', 'QUALITY_INSPECTOR', 'LINE_LEADER'],
  DISPOSITION_DEFECT:     ['QUALITY_ENGINEER', 'QUALITY_INSPECTOR'],
  APPROVE_UAI:            ['QUALITY_ENGINEER', 'PLANT_MANAGER'],
  CLOSE_BREAKDOWN:        ['MAINTENANCE_TECH', 'PRODUCTION_MANAGER'],
  SIGN_HANDOVER:          ['SHIFT_SUPERVISOR'],
  EOL_CERTIFY:            ['QUALITY_INSPECTOR', 'QUALITY_ENGINEER'],
  // ---- Supply chain ----
  APPROVE_PR_L1:          ['BUYER', 'SENIOR_BUYER', 'PROGRAM_MANAGER'],
  APPROVE_PR_L2:          ['SENIOR_BUYER', 'FINANCE_CONTROLLER'],
  APPROVE_PR_L3:          ['CPO', 'FINANCE_CONTROLLER'],
  CREATE_RFQ:             ['BUYER', 'SENIOR_BUYER'],
  AWARD_RFQ:              ['SENIOR_BUYER', 'CPO'],
  CREATE_PO:              ['BUYER', 'SENIOR_BUYER'],
  EXPEDITE_PO:            ['BUYER', 'SENIOR_BUYER', 'INVENTORY_MANAGER'],
  APPROVE_AIR_FREIGHT:    ['CPO', 'FINANCE_CONTROLLER'],
  IQC_GRN:                ['QUALITY_INSPECTOR', 'SUPPLIER_QUALITY_ENGINEER'],
  PROCESS_PAYMENT:        ['FINANCE_CONTROLLER'],
  ONBOARD_SUPPLIER:       ['SENIOR_BUYER', 'CPO', 'SUPPLIER_QUALITY_ENGINEER'],
  SUSPEND_SUPPLIER:       ['CPO'],
  APPROVE_CONTRACT:       ['CPO', 'FINANCE_CONTROLLER'],
}

export function can(role: Role | undefined | null, action: Action): boolean {
  if (!role) return false
  if (role === 'SYS_ADMIN') return true
  return matrix[action]?.includes(role) ?? false
}

export function canAny(role: Role | undefined | null, actions: Action[]): boolean {
  return actions.some((a) => can(role, a))
}

// Threshold-driven PR approver chain (PRD-03 §5.2)
export type PrApprovalLevel = 'L1' | 'L2' | 'L3'
export function prApprovalLevel(amountInr: number): PrApprovalLevel {
  if (amountInr <= 50_000) return 'L1'
  if (amountInr <= 500_000) return 'L2'
  return 'L3'
}

export function prApproverActions(amountInr: number): Action[] {
  const level = prApprovalLevel(amountInr)
  if (level === 'L1') return ['APPROVE_PR_L1']
  if (level === 'L2') return ['APPROVE_PR_L1', 'APPROVE_PR_L2']
  return ['APPROVE_PR_L1', 'APPROVE_PR_L2', 'APPROVE_PR_L3']
}
