import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  AlertTriangle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  MoreVertical, 
  Search, 
  Filter,
  ArrowRight,
  ChevronRight,
  User,
  Plus
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const TaskCard = ({ task }: any) => {
  const navigate = useNavigate()
  const path = task.module === 'ENGINEERING CHANGE' ? '/engineering-change' : 
               task.module === 'BILL OF MATERIALS' ? '/bom' : 
               task.module === 'DVP&R' ? '/dvpr' : 
               task.module === 'PPAP' ? '/apqp/PRG-8042' : 
               task.module === 'GATE REVIEW' ? '/gate-approvals' : '/dashboard'
               
  return (
    <div 
      onClick={() => navigate(path)}
      className={cn(
        "card p-4 space-y-4 hover:shadow-md transition-shadow cursor-pointer group border-l-4",
        task.overdue ? "border-l-red-500" : "border-l-transparent"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em]">{task.module}</span>
          <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors leading-tight">{task.title}</h4>
        </div>
        <button className="text-gray-300 hover:text-text-primary transition-colors"><MoreVertical size={14} /></button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-1.5 py-0.5 bg-surface text-text-secondary text-[9px] font-black rounded uppercase tracking-widest">{task.ref}</span>
        <span className={cn(
          "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
          task.priority === 'Critical' ? "bg-red-50 text-red-500" : 
          task.priority === 'High' ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"
        )}>
          {task.priority}
        </span>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex -space-x-1.5" title="Assignees">
          {task.assignees?.map((assignee: string, i: number) => (
            <div key={i} title={assignee} className="w-6 h-6 rounded-full border-2 border-white bg-surface flex items-center justify-center text-[8px] font-black text-text-secondary shadow-sm">
              {assignee.split(' ').map((n: string) => n[0]).join('')}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-[9px] font-bold flex items-center gap-1",
            task.overdue ? "text-red-500" : "text-text-secondary"
          )}>
            <Clock size={10} /> {task.due}
          </span>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 bg-teal-50 text-accent rounded hover:bg-accent hover:text-white transition-all shadow-sm"
          >
            <CheckCircle2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

const MyTasks = () => {
  const navigate = useNavigate()
  const columns = [
    { 
      id: 'overdue', 
      label: 'Overdue', 
      icon: AlertTriangle, 
      color: 'text-red-500', 
      bg: 'bg-red-500',
      tasks: [
        { module: 'ENGINEERING CHANGE', title: 'Approve ECO-4092: Thermal Revision', ref: '#ECO-4092', priority: 'Critical', due: '2 Days Overdue', overdue: true, assignees: ['Alex R.', 'Mike R.'] },
        { module: 'BILL OF MATERIALS', title: 'Update BIW Assembly V4 weights', ref: '#BOM-221', priority: 'High', due: 'Yesterday', overdue: true, assignees: ['Alex R.'] },
        { module: 'DVP&R', title: 'Upload Crash Test Results', ref: '#TR-881', priority: 'Critical', due: '3 Days Overdue', overdue: true, assignees: ['Sarah J.'] },
        { module: 'GATE REVIEW', title: 'Submit Gate 1 Deliverables', ref: '#GATE-01', priority: 'High', due: 'Yesterday', overdue: true, assignees: ['David K.', 'Alex R.'] },
        { module: 'PPAP', title: 'Review FMEA Documentation', ref: '#PPAP-05', priority: 'Medium', due: '2 Days Overdue', overdue: true, assignees: ['Mike R.'] },
        { module: 'ENGINEERING CHANGE', title: 'Review ECO-4088', ref: '#ECO-4088', priority: 'High', due: '4 Days Overdue', overdue: true, assignees: ['Sarah J.', 'David K.'] },
      ]
    },
    { 
      id: 'today', 
      label: 'Due Today', 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500',
      tasks: [
        { module: 'DESIGN REVIEW', title: 'Exterior Lighting Mesh Review', ref: '#DR-092', priority: 'Medium', due: 'Due 5 PM', overdue: false, assignees: ['Alex R.', 'Sarah J.', 'David K.'] },
        { module: 'DVP&R', title: 'Sign-off IP67 Test Results', ref: '#TR-904', priority: 'High', due: 'Due 6 PM', overdue: false, assignees: ['Alex R.'] },
        { module: 'PPAP', title: 'Upload Dimensional Report Element 9', ref: '#PPAP-12', priority: 'High', due: 'Due Today', overdue: false, assignees: ['Alex R.', 'Mike R.'] },
        { module: 'BILL OF MATERIALS', title: 'Release MBOM for Delta Pickup', ref: '#BOM-305', priority: 'High', due: 'Due 4 PM', overdue: false, assignees: ['David K.'] },
        { module: 'ENGINEERING CHANGE', title: 'Approve ECO-4105', ref: '#ECO-4105', priority: 'Critical', due: 'Due 2 PM', overdue: false, assignees: ['Sarah J.'] },
        { module: 'GATE REVIEW', title: 'Gate 2 Pre-meeting', ref: '#GATE-02', priority: 'Medium', due: 'Due 1 PM', overdue: false, assignees: ['Mike R.', 'David K.'] },
        { module: 'DESIGN REVIEW', title: 'Battery Enclosure Review', ref: '#DR-095', priority: 'High', due: 'Due 3 PM', overdue: false, assignees: ['Alex R.', 'Sarah J.'] },
        { module: 'PPAP', title: 'Verify Control Plan', ref: '#PPAP-15', priority: 'Medium', due: 'Due Today', overdue: false, assignees: ['David K.'] },
        { module: 'DVP&R', title: 'Review NVH Test Setup', ref: '#TR-912', priority: 'Low', due: 'Due 5 PM', overdue: false, assignees: ['Mike R.'] },
      ]
    },
    { 
      id: 'upcoming', 
      label: 'Upcoming', 
      icon: Calendar, 
      color: 'text-accent', 
      bg: 'bg-accent',
      tasks: [
        { module: 'GATE REVIEW', title: 'Preparation for Gate 2 - Alpha SUV', ref: '#GATE-02', priority: 'Medium', due: 'Tomorrow', overdue: false, assignees: ['Alex R.', 'Sarah J.'] },
        { module: 'CAD REVIEW', title: 'Review Lower Chassis Castings', ref: '#CAD-881', priority: 'Low', due: 'May 16', overdue: false, assignees: ['Alex R.'] },
        { module: 'BILL OF MATERIALS', title: 'Audit Gamma Hatchback BOM', ref: '#BOM-412', priority: 'Medium', due: 'May 17', overdue: false, assignees: ['David K.'] },
        { module: 'ENGINEERING CHANGE', title: 'Draft ECO for Inverter Update', ref: '#ECO-4122', priority: 'High', due: 'May 18', overdue: false, assignees: ['Sarah J.', 'Mike R.'] },
        { module: 'PPAP', title: 'Review Supplier PSW', ref: '#PPAP-20', priority: 'High', due: 'May 19', overdue: false, assignees: ['Alex R.'] },
        { module: 'DVP&R', title: 'Schedule Payload Test', ref: '#TR-950', priority: 'Medium', due: 'May 20', overdue: false, assignees: ['Mike R.', 'David K.'] },
      ]
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Tasks & Action Items</h1>
          <p className="text-text-secondary">Manage and track your assigned engineering actions and reviews.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface border border-border-dark rounded-lg p-1 shadow-sm">
            <button className="px-4 py-1.5 text-xs font-bold rounded transition-all bg-sidebar text-white shadow-sm">Board</button>
            <button className="px-4 py-1.5 text-xs font-bold rounded transition-all text-text-secondary hover:bg-primary">List</button>
          </div>
          <button 
            onClick={() => navigate('/programs')}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Create Task
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input type="text" placeholder="Search tasks by title, ref, or module..." className="w-full bg-surface border border-border-dark rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-accent shadow-sm" />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface border border-border-dark rounded-lg text-xs font-bold text-text-secondary hover:bg-primary flex items-center gap-2 shadow-sm">
            <Filter size={16} /> Filters
          </button>
          <select className="bg-surface border border-border-dark rounded-lg px-4 py-2 text-xs font-bold text-text-primary outline-none shadow-sm">
            <option>All Modules</option>
            <option>Engineering Change</option>
            <option>DVP&R</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto min-h-0">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {columns.map((col) => (
            <div key={col.id} className="flex-1 flex flex-col gap-4 min-w-[320px]">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <col.icon size={18} className={col.color} />
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">{col.label}</h3>
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white", col.bg)}>
                    {col.tasks.length}
                  </span>
                </div>
                <button className="text-gray-300 hover:text-text-primary transition-colors"><Plus size={16} /></button>
              </div>
              
              <div className="flex-1 bg-surface/30 rounded-xl p-4 space-y-4 overflow-y-auto border border-border-dark/50">
                {col.tasks.map((task, i) => (
                  <TaskCard key={i} task={task} />
                ))}
                <button 
                  onClick={() => navigate('/programs')}
                  className="w-full py-3 border-2 border-dashed border-border-dark rounded-xl text-[10px] font-black text-text-secondary uppercase tracking-widest hover:border-teal-300 hover:text-accent hover:bg-teal-50/20 transition-all"
                >
                  + Add Action Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyTasks
