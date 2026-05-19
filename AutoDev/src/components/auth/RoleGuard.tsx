import type { ReactNode } from 'react'
import { useAuthStore, type Role } from '../../stores/authStore'
import { can, type Action } from '../../lib/permissions'
import { ShieldAlert } from 'lucide-react'

type Props =
  | { roles: Role[]; action?: never; children: ReactNode; fallback?: ReactNode }
  | { roles?: never; action: Action; children: ReactNode; fallback?: ReactNode }
  | { roles: Role[]; action: Action; children: ReactNode; fallback?: ReactNode }

export function RoleGuard(props: Props) {
  const user = useAuthStore((s) => s.user)
  const role = user?.role
  let allowed = false
  if (props.action && props.roles) {
    allowed = !!role && props.roles.includes(role) && can(role, props.action)
  } else if (props.action) {
    allowed = can(role, props.action)
  } else if (props.roles) {
    allowed = !!role && (role === 'SYS_ADMIN' || props.roles.includes(role))
  }

  if (allowed) return <>{props.children}</>
  if (props.fallback !== undefined) return <>{props.fallback}</>
  return (
    <div className="p-12 text-center">
      <ShieldAlert size={48} className="mx-auto text-warning mb-4" />
      <h2 className="text-xl font-bold text-text-primary mb-2">
        Access restricted
      </h2>
      <p className="text-text-secondary text-sm">
        Your role <span className="font-mono">{role ?? 'GUEST'}</span> does not have permission for this area.
      </p>
    </div>
  )
}

export default RoleGuard
