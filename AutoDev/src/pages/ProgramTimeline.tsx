import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Filter, 
  Download, 
  ZoomIn, 
  ZoomOut,
  MoreHorizontal
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const GanttTaskRow = ({ task, level = 0 }: any) => {
  const [expanded, setExpanded] = React.useState(true)
  
  return (
    <>
      <div className="flex h-12 border-b border-border-dark hover:bg-primary/50 transition-colors group">
        <div className="w-[300px] flex items-center px-4 border-r border-border-dark shrink-0">
          <div style={{ marginLeft: `${level * 16}px` }} className="flex items-center gap-2">
            {task.subtasks ? (
              <button onClick={() => setExpanded(!expanded)} className="text-text-secondary hover:text-text-primary transition-colors">
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : <div className="w-3.5" />}
            <span className={cn("text-xs font-bold truncate", level === 0 ? "text-text-primary" : "text-text-secondary")}>
              {task.name}
            </span>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden flex items-center">
          {/* Timeline columns background */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-gray-50" />
            ))}
          </div>
          
          {/* Today Marker */}
          <div className="absolute top-0 bottom-0 w-px bg-red-400 z-10 left-[45%]" />

          {/* Task Bar */}
          {task.start && (
            <div 
              className={cn(
                "absolute h-6 rounded-md flex items-center px-3 text-[9px] font-black uppercase tracking-tighter overflow-hidden z-20",
                task.status === 'completed' ? "bg-accent text-white" :
                task.status === 'delayed' ? "bg-red-500 text-white" : "bg-gray-200 text-text-secondary"
              )}
              style={{ left: `${task.start}%`, width: `${task.duration}%` }}
            >
              {task.progress && <span className="mr-2">{task.progress}%</span>}
              <span className="truncate">{task.name}</span>
            </div>
          )}

          {/* Milestone Diamond */}
          {task.milestone && (
            <div 
              className="absolute w-3 h-3 bg-sidebar rotate-45 z-30 shadow-sm"
              style={{ left: `${task.milestone}%` }}
            />
          )}
        </div>
      </div>
      {expanded && task.subtasks?.map((sub: any, i: number) => (
        <GanttTaskRow key={i} task={sub} level={level + 1} />
      ))}
    </>
  )
}

const ProgramTimeline = () => {
  const navigate = useNavigate()
  const [view, setView] = React.useState('months')

  const tasks = [
    { 
      name: '1.0 Concept Phase', 
      subtasks: [
        { name: 'Feasibility Study', start: 10, duration: 15, progress: 100, status: 'completed' },
        { name: 'Initial Design Review', milestone: 25 },
        { name: 'Market Analysis', start: 15, duration: 20, progress: 100, status: 'completed' },
      ]
    },
    { 
      name: '2.0 Product Design', 
      subtasks: [
        { name: 'CAD Modeling - Exterior', start: 30, duration: 25, progress: 65, status: 'in-progress' },
        { name: 'Thermal Systems Design', start: 35, duration: 30, progress: 40, status: 'delayed' },
        { name: 'Gate 2 Review', milestone: 65 },
      ]
    },
    { 
      name: '3.0 Engineering & Validation', 
      subtasks: [
        { name: 'Prototype Build A', start: 65, duration: 15, progress: 0, status: 'pending' },
        { name: 'Crash Safety Testing', start: 75, duration: 20, progress: 0, status: 'pending' },
      ]
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-1">
            <span className="hover:text-accent cursor-pointer" onClick={() => navigate('/programs')}>Programs</span> 
            <ChevronRight size={12} /> 
            <span>Alpha SUV (P-2025)</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Program Timeline</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface border border-border-dark rounded-lg p-1">
            <button 
              onClick={() => setView('months')}
              className={cn("px-4 py-1.5 text-xs font-bold rounded transition-all", view === 'months' ? "bg-sidebar text-white" : "text-text-secondary hover:bg-primary")}
            >
              Months
            </button>
            <button 
              onClick={() => setView('weeks')}
              className={cn("px-4 py-1.5 text-xs font-bold rounded transition-all", view === 'weeks' ? "bg-sidebar text-white" : "text-text-secondary hover:bg-primary")}
            >
              Weeks
            </button>
          </div>
          <button className="p-2.5 bg-surface border border-border-dark rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary transition-all">
            <Filter size={18} />
          </button>
          <button className="p-2.5 bg-surface border border-border-dark rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary transition-all">
            <Download size={18} />
          </button>
          <button 
            onClick={() => navigate('/programs')}
            className="bg-accent text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-accent/90 shadow-lg shadow-teal-500/20 transition-all"
          >
            Export Timeline
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Gantt Header */}
        <div className="flex bg-primary border-b border-border-dark h-12">
          <div className="w-[300px] flex items-center px-4 border-r border-border-dark text-[10px] font-black text-text-secondary uppercase tracking-widest shrink-0">
            Workstream / Task Name
          </div>
          <div className="flex-1 flex overflow-hidden">
            {['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'].map((month, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-center border-r border-border-dark px-2 min-w-[80px]">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-tighter">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Content */}
        <div className="overflow-y-auto max-h-[600px]">
          {tasks.map((task, i) => (
            <GanttTaskRow key={i} task={task} />
          ))}
        </div>

        {/* Gantt Footer / Controls */}
        <div className="p-4 bg-primary border-t border-border-dark flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-sm" />
              <span className="text-[10px] font-bold uppercase text-text-secondary tracking-wider">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-sm" />
              <span className="text-[10px] font-bold uppercase text-text-secondary tracking-wider">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span className="text-[10px] font-bold uppercase text-text-secondary tracking-wider">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sidebar rotate-45" />
              <span className="text-[10px] font-bold uppercase text-text-secondary tracking-wider">Milestone Gate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-px h-4 bg-red-400" />
              <span className="text-[10px] font-bold uppercase text-text-secondary tracking-wider">Today</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-bold text-accent hover:underline">
              <Calendar size={14} /> Jump to Today
            </button>
            <div className="flex border border-border-dark rounded-lg overflow-hidden bg-surface">
              <button className="p-2 border-r border-border-dark text-text-secondary hover:text-text-primary transition-colors"><ZoomIn size={16} /></button>
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors"><ZoomOut size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramTimeline
