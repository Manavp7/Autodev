import { initialsOf } from '../stores/authStore'

const make = (id, username, name, email, role, designation, plant) => ({
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

export const DEMO_USERS = [
  make('U-001', 'admin',     'Alex Rivera',    'alex@auto-suite.dev',     'SYS_ADMIN',           'System Administrator'),
  make('U-201', 'cpo',       'Rajesh Kumar',   'rajesh@auto-suite.dev',   'CPO',                 'Chief Procurement Officer'),
  make('U-202', 'srbuyer',   'Anita Verma',    'anita@auto-suite.dev',    'SENIOR_BUYER',        'Senior Buyer'),
  make('U-203', 'buyer',     'Jason Smith',    'jason@auto-suite.dev',    'BUYER',               'Buyer'),
  make('U-204', 'sqe',       'Naomi Chen',     'naomi@auto-suite.dev',    'SUPPLIER_QUALITY_ENGINEER', 'Supplier Quality Engineer'),
  make('U-205', 'inv',       'Tomas Werner',   'tomas@auto-suite.dev',    'INVENTORY_MANAGER',   'Inventory Manager'),
  make('U-206', 'finance',   'David Miller',   'david.m@auto-suite.dev',  'FINANCE_CONTROLLER',  'Finance Controller'),
  make('U-207', 'supplier',  'Bosch Liaison',  'liaison@bosch-india.com', 'SUPPLIER_PORTAL',     'Supplier Portal Account'),
]

export function findDemoUser(usernameOrEmail, password) {
  return DEMO_USERS.find(
    (u) =>
      u.password === password &&
      (u.username.toLowerCase() === String(usernameOrEmail).toLowerCase() ||
        u.email.toLowerCase() === String(usernameOrEmail).toLowerCase())
  )
}
