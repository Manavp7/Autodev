import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTaktTime(seconds: number): string {
  const abs = Math.abs(seconds)
  const m = Math.floor(abs / 60).toString().padStart(2, '0')
  const s = (abs % 60).toString().padStart(2, '0')
  return seconds < 0 ? `-${m}:${s}` : `${m}:${s}`
}

export function calculateOee(avail: number, perf: number, qual: number): number {
  return parseFloat(((avail / 100) * (perf / 100) * (qual / 100) * 100).toFixed(1))
}

export function slaStatus(dueAt: Date): { label: string; isBreached: boolean; minutesLeft: number } {
  const minutesLeft = Math.round((dueAt.getTime() - Date.now()) / 60000)
  return {
    label: minutesLeft < 0 ? `-${Math.abs(minutesLeft)}m (Breached)` : `${minutesLeft}m left`,
    isBreached: minutesLeft < 0,
    minutesLeft,
  }
}

export function lifeCyclePct(current: number, max: number): number {
  return Math.min(100, Math.round((current / max) * 100))
}

export function lifeCycleColor(pct: number): string {
  if (pct >= 90) return 'bg-red-500'
  if (pct >= 70) return 'bg-orange-500'
  return 'bg-green-500'
}
