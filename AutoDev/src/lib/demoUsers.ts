// Demo accounts for the dev-only login screen. Never imported in production
// builds: gated by import.meta.env.DEV.

import type { SessionUser } from '../stores/authStore'
import { initialsOf } from '../stores/authStore'

export interface DemoCredential extends SessionUser {
  username: string
  password: string
}

const make = (
  id: string,
  username: string,
  name: string,
  email: string,
  role: SessionUser['role'],
  designation: string,
  plant?: string
): DemoCredential => ({
  id,
  username,
  password: '123',
  name,
  email,
  role,
  designation,
  plant,
  avatarInitials: initialsOf(name),
})

export const DEMO_USERS: DemoCredential[] = [
  // R&D
  make('U-001', 'admin',     'Alex Rivera',    'alex@auto-suite.dev',     'SYS_ADMIN',           'System Administrator'),
  make('U-002', 'chief',     'Mei Tanaka',     'mei@auto-suite.dev',      'CHIEF_ENGINEER',      'Chief Engineer'),
  make('U-003', 'engineer',  'Sarah Jenkins',  'sarah@auto-suite.dev',    'DESIGN_ENGINEER',     'Sr. Design Engineer'),
  make('U-004', 'pm',        'David Kim',      'david@auto-suite.dev',    'PROGRAM_MANAGER',     'Program Manager'),
  make('U-005', 'quality',   'Elena Petrova',  'elena@auto-suite.dev',    'QUALITY_ENGINEER',    'APQP Lead'),
  make('U-006', 'val',       'Marcus Reid',    'marcus@auto-suite.dev',   'VALIDATION_ENGINEER', 'Validation Engineer'),
  make('U-007', 'docs',      'Priya Shah',     'priya@auto-suite.dev',    'DOCUMENT_CONTROLLER', 'Document Controller'),
  // Manufacturing
  make('U-101', 'plantmgr',  'Ravi Iyer',      'ravi@auto-suite.dev',     'PLANT_MANAGER',       'Plant Manager',         'Pune-1'),
  make('U-102', 'manager',   'Hannah Klein',   'hannah@auto-suite.dev',   'PRODUCTION_MANAGER',  'Production Manager',    'Pune-1'),
  make('U-103', 'lead',      'Aiden Park',     'aiden@auto-suite.dev',    'SHIFT_SUPERVISOR',    'Shift Lead',            'Pune-1'),
  make('U-104', 'leader',    'Carla Mendes',   'carla@auto-suite.dev',    'LINE_LEADER',         'Line Leader',           'Pune-1'),
  make('U-105', 'operator',  'Joaquin Reyes',  'joaquin@auto-suite.dev',  'MACHINE_OPERATOR',    'Operator',              'Pune-1'),
  make('U-106', 'planner',   'Fatima Noor',    'fatima@auto-suite.dev',   'PRODUCTION_PLANNER',  'Production Planner',    'Pune-1'),
  make('U-107', 'maint',     'Yuri Sokolov',   'yuri@auto-suite.dev',     'MAINTENANCE_TECH',    'Maintenance Technician','Pune-1'),
  make('U-108', 'inspect',   'Olu Adeyemi',    'olu@auto-suite.dev',      'QUALITY_INSPECTOR',   'Quality Inspector',     'Pune-1'),
  // Supply chain
  make('U-201', 'cpo',       'Rajesh Kumar',   'rajesh@auto-suite.dev',   'CPO',                 'Chief Procurement Officer'),
  make('U-202', 'srbuyer',   'Anita Verma',    'anita@auto-suite.dev',    'SENIOR_BUYER',        'Senior Buyer'),
  make('U-203', 'buyer',     'Jason Smith',    'jason@auto-suite.dev',    'BUYER',               'Buyer'),
  make('U-204', 'sqe',       'Naomi Chen',     'naomi@auto-suite.dev',    'SUPPLIER_QUALITY_ENGINEER', 'Supplier Quality Engineer'),
  make('U-205', 'inv',       'Tomas Werner',   'tomas@auto-suite.dev',    'INVENTORY_MANAGER',   'Inventory Manager'),
  make('U-206', 'finance',   'David Miller',   'david.m@auto-suite.dev',  'FINANCE_CONTROLLER',  'Finance Controller'),
  make('U-207', 'supplier',  'Bosch Liaison',  'liaison@bosch-india.com', 'SUPPLIER_PORTAL',     'Supplier Portal Account'),
]

export function findDemoUser(usernameOrEmail: string, password: string): DemoCredential | undefined {
  return DEMO_USERS.find(
    (u) =>
      u.password === password &&
      (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.toLowerCase())
  )
}
