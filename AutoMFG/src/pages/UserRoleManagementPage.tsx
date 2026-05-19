import { useState } from 'react'
import { Plus, Search, UserPlus, Edit2, ToggleLeft, ToggleRight, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api'
import type { User } from '@/types'

type Role = 'plant_manager' | 'supervisor' | 'operator' | 'maintenance' | 'quality' | 'admin'

const ROLE_CFG: Record<Role, { label: string; color: string }> = {
  plant_manager: { label: 'Plant Manager',  color: 'bg-purple-100 text-purple-700' },
  supervisor:    { label: 'Supervisor',     color: 'bg-blue-100 text-blue-700' },
  operator:      { label: 'Operator',       color: 'bg-green-100 text-green-700' },
  maintenance:   { label: 'Maintenance',    color: 'bg-orange-100 text-orange-700' },
  quality:       { label: 'Quality',        color: 'bg-pink-100 text-pink-700' },
  admin:         { label: 'Admin',          color: 'bg-red-100 text-red-700' },
}

const BLANK_FORM = { name: '', email: '', role: 'operator' as Role, badgeId: '', plant: 'Detroit-04' }

export function UserRoleManagementPage() {
  const qc = useQueryClient()
  const toast = useToast()
  
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(BLANK_FORM)

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  })

  const addUser = useMutation({
    mutationFn: (payload: any) => usersApi.create(payload),
    onSuccess: (newUser) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast(`${newUser.name} added as ${ROLE_CFG[newUser.role as Role].label}`, 'success')
      setShowAdd(false)
      setForm(BLANK_FORM)
    },
    onError: () => toast('Failed to add user', 'error'),
  })

  const updateUser = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => usersApi.update(id, payload),
    onSuccess: (updatedUser) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast(`User ${updatedUser.name} updated successfully`, 'success')
      setEditId(null)
    },
    onError: () => toast('Failed to update user', 'error'),
  })

  const filtered = users.filter((u: User) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const handleAddUser = () => {
    if (!form.name || !form.email) { toast('Name and email are required', 'error'); return }
    addUser.mutate(form)
  }

  const toggleActive = (user: User) => {
    updateUser.mutate({ id: user.id, payload: { isActive: !user.isActive } })
  }

  const changeRole = (id: string, role: Role) => {
    updateUser.mutate({ id, payload: { role } })
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl flex items-center gap-3"><Shield size={24} className="text-forest-600"/> User & Role Management</h1>
          <p className="text-body text-text-secondary">{users.filter((u: User) => u.isActive).length} active users · {users.filter((u: User) => !u.isActive).length} inactive</p>
        </div>
        <Button variant="primary" iconLeft={<UserPlus size={16}/>} onClick={() => setShowAdd(true)}>Add User</Button>
      </div>

      <Card className="p-4 flex gap-3">
        <Input className="flex-1" placeholder="Search by name or email..." iconLeft={<Search size={16}/>}
          value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          options={[{label:'All Roles',value:'all'}, ...Object.entries(ROLE_CFG).map(([v, c]) => ({label: c.label, value: v}))]} />
        <span className="text-body-sm text-text-muted self-center">{filtered.length} users</span>
      </Card>

      <Card className="flex-1 p-0 overflow-hidden flex flex-col">
        <table className="w-full text-left">
          <thead className="bg-surface border-b border-border text-label text-text-muted uppercase sticky top-0">
            <tr>
              <th className="p-3">NAME</th>
              <th className="p-3">EMAIL</th>
              <th className="p-3">ROLE</th>
              <th className="p-3">BADGE</th>
              <th className="p-3 text-center">STATUS</th>
              <th className="p-3"/>
            </tr>
          </thead>
          <tbody className="text-body-sm divide-y divide-border">
            {isLoading && <tr><td colSpan={6} className="p-8 text-center text-text-muted">Loading…</td></tr>}
            {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-text-muted">No users found.</td></tr>}
            {filtered.map((u: User) => (
              <tr key={u.id} className={`hover:bg-surface ${!u.isActive ? 'opacity-50' : ''}`}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-xs font-bold uppercase">
                      {u.avatarInitials || u.name.substring(0, 2)}
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="p-3 text-text-secondary">{u.email}</td>
                <td className="p-3">
                  {editId === u.id ? (
                    <Select value={u.role} onChange={e => changeRole(u.id, e.target.value as Role)}
                      options={Object.entries(ROLE_CFG).map(([v, c]) => ({label: c.label, value: v}))} />
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 ${ROLE_CFG[u.role as Role]?.color ?? 'bg-gray-100'}`}
                      onClick={() => setEditId(u.id)}>
                      {ROLE_CFG[u.role as Role]?.label ?? u.role}
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono text-text-secondary">{u.badgeId}</td>
                <td className="p-3 text-center">
                  <button onClick={() => toggleActive(u)} className="flex items-center gap-1 mx-auto" disabled={updateUser.isPending}>
                    {u.isActive
                      ? <><ToggleRight size={22} className="text-forest-600"/><span className="text-green-600 text-xs font-medium">Active</span></>
                      : <><ToggleLeft size={22} className="text-gray-400"/><span className="text-gray-500 text-xs font-medium">Inactive</span></>
                    }
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => setEditId(editId === u.id ? null : u.id)}
                    className="text-text-muted hover:text-text-primary transition-colors">
                    <Edit2 size={15}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-heading-md mb-4">Add New User</h2>
            <div className="space-y-3">
              <div><label className="block text-body-sm font-medium mb-1">Full Name *</label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="John Doe" /></div>
              <div><label className="block text-body-sm font-medium mb-1">Email *</label><Input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="user@automfg.com" /></div>
              <div><label className="block text-body-sm font-medium mb-1">Role</label>
                <Select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value as Role}))}
                  options={Object.entries(ROLE_CFG).map(([v, c]) => ({label: c.label, value: v}))} />
              </div>
              <div><label className="block text-body-sm font-medium mb-1">Badge ID</label><Input value={form.badgeId} onChange={e => setForm(f => ({...f, badgeId: e.target.value}))} placeholder="100000" /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleAddUser} disabled={addUser.isPending}>Add User</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
