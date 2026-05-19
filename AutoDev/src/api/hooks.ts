// React-Query hooks against the local mock client.
// One hook per concern; the page layer only ever sees data + isLoading.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type {
  Approval,
  BomNode,
  DocItem,
  Eco,
  Program,
  Task,
  Test,
  UserRecord,
} from '../lib/mockData'

// ---------- Programs ----------
export const programsKey = ['programs'] as const
export const useProgramsQuery = () =>
  useQuery({
    queryKey: programsKey,
    queryFn: async () => (await api.get<Program[]>('/programs')).data,
  })

export const useProgramQuery = (id?: string) =>
  useQuery({
    queryKey: ['program', id],
    queryFn: async () => (await api.get<Program>(`/programs/${id}`)).data,
    enabled: !!id,
  })

export const useCreateProgramMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Program>) =>
      (await api.post<Program>('/programs', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: programsKey }),
  })
}

export const useApproveGateMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { programId: string; gate: number; approver: string; signature: string; comment?: string }) =>
      (await api.post<Program>(`/programs/${vars.programId}/gates/${vars.gate}/approve`, vars)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: programsKey }),
  })
}

// ---------- BOM ----------
export const useBomQuery = (programId?: string) =>
  useQuery({
    queryKey: ['bom', programId],
    queryFn: async () => (await api.get<BomNode[]>(`/bom/${programId}`)).data,
    enabled: !!programId,
  })

export const useReleaseBomMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (programId: string) =>
      (await api.post(`/bom/${programId}/release`, {})).data,
    onSuccess: (_, programId) => qc.invalidateQueries({ queryKey: ['bom', programId] }),
  })
}

// ---------- ECOs ----------
export const useEcosQuery = () =>
  useQuery({
    queryKey: ['ecos'],
    queryFn: async () => (await api.get<Eco[]>('/ecos')).data,
  })

export const useCreateEcoMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Eco>) =>
      (await api.post<Eco>('/ecos', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ecos'] }),
  })
}

export const useVoteEcoMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { id: string; vote: { user: string; decision: 'Approve' | 'Reject' | 'More Info'; comment?: string } }) =>
      (await api.post<Eco>(`/ecos/${vars.id}/vote`, vars.vote)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ecos'] }),
  })
}

export const useApproveEcoMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => (await api.post<Eco>(`/ecos/${id}/approve`, {})).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ecos'] }),
  })
}

// ---------- DVP&R ----------
export const useDvprQuery = (partId?: string) =>
  useQuery({
    queryKey: ['dvpr', partId],
    queryFn: async () => (await api.get<Test[]>(`/dvpr/${partId}`)).data,
    enabled: !!partId,
  })

export const useUpdateTestMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { partId: string; testId: string; patch: Partial<Test> }) =>
      (await api.patch<Test>(`/dvpr/${vars.partId}/tests/${vars.testId}`, vars.patch)).data,
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['dvpr', vars.partId] }),
  })
}

// ---------- Approvals ----------
export const useApprovalsQuery = () =>
  useQuery({
    queryKey: ['approvals'],
    queryFn: async () => (await api.get<Approval[]>('/approvals')).data,
  })

export const useDecideApprovalMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { id: string; decision: Approval['status']; approver: string; signature: string; comment?: string }) =>
      (await api.post<Approval>(`/approvals/${vars.id}/decide`, vars)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['approvals'] }),
  })
}

// ---------- Tasks ----------
export const useTasksQuery = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: async () => (await api.get<Task[]>('/tasks')).data,
  })

export const useUpdateTaskMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<Task> }) =>
      (await api.patch<Task>(`/tasks/${vars.id}`, vars.patch)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export const useCreateTaskMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Task>) =>
      (await api.post<Task>('/tasks', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

// ---------- Documents ----------
export const useDocumentsQuery = () =>
  useQuery({
    queryKey: ['documents'],
    queryFn: async () => (await api.get<DocItem[]>('/documents')).data,
  })

export const useCreateDocumentMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<DocItem>) =>
      (await api.post<DocItem>('/documents', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  })
}

// ---------- Users ----------
export const useUsersQuery = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get<UserRecord[]>('/users')).data,
  })

export const useInviteUserMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<UserRecord>) =>
      (await api.post<UserRecord>('/users', { ...payload, pending: true, active: false })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useUpdateUserMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<UserRecord> }) =>
      (await api.patch<UserRecord>(`/users/${vars.id}`, vars.patch)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useDeleteUserMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

// ---------- Integrations ----------
export interface IntegrationStatus {
  id: string
  name: string
  status: string
  lastPing?: string
}

export const useIntegrationsQuery = () =>
  useQuery({
    queryKey: ['integrations'],
    queryFn: async () => (await api.get<IntegrationStatus[]>('/integrations')).data,
  })
