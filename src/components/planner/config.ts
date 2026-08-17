import type { CalendarEventType } from '@/types/planner';

// ==============================|| PLANNER - CONFIG ||============================== //

export const EVENT_TYPE_CONFIG: Record<CalendarEventType, { label: string; color: string; badgeClass: string }> = {
  study: { label: 'Study', color: '#3b82f6', badgeClass: 'bg-blue-500/20 text-blue-400' },
  interview: { label: 'Interview', color: '#ef4444', badgeClass: 'bg-red-500/20 text-red-400' },
  'job-search': { label: 'Job Search', color: '#f59e0b', badgeClass: 'bg-amber-500/20 text-amber-400' },
  'machine-coding': { label: 'Machine Coding', color: '#8b5cf6', badgeClass: 'bg-purple-500/20 text-purple-400' },
  personal: { label: 'Personal', color: '#10b981', badgeClass: 'bg-emerald-500/20 text-emerald-400' },
  other: { label: 'Other', color: '#6b7280', badgeClass: 'bg-gray-500/20 text-gray-400' }
};

export const EVENT_TYPE_ORDER: CalendarEventType[] = ['interview', 'study', 'machine-coding', 'job-search', 'personal', 'other'];
