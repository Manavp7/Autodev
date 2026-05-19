import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FileEdit, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Upload,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useToast } from '../components/ui/Toast'


const KPICard = ({ title, value, icon: Icon, color, trend, path }: any) => (
  <Link to={path || '#'} className="card p-6 flex flex-col gap-4 hover:border-accent transition-all hover:shadow-md group">
    <div className="flex justify-between items-start">
      <div className={cn("p-2 rounded-lg transition-all group-hover:scale-110", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-green-500">
          <ArrowUpRight size={14} /> {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-text-secondary text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
    </div>
  </Link>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [completedTasks, setCompletedTasks] = React.useState<number[]>([])

  const handleTaskToggle = (id: number, title: string) => {
    if (completedTasks.includes(id)) {
      setCompletedTasks(prev => prev.filter(tid => tid !== id))
    } else {
      setCompletedTasks(prev => [...prev, id])
      console.log(`Completed: ${title}`, 'success')
    }
  }

  const tasks = [
    { id: 1, title: 'Review Gate 2 Documentation - Alpha SUV', due: 'Today', status: 'urgent', assignees: ['Alex R.', 'Sarah J.'] },
    { id: 2, title: 'Approve ECO-4092: Battery Thermal Module', due: 'Today', status: 'urgent', assignees: ['Alex R.'] },
    { id: 3, title: 'Update DVP&R for Chassis Stability Test', due: 'Tomorrow', status: 'normal', assignees: ['Alex R.', 'Mike R.'] },
    { id: 4, title: 'Verify PPAP Element 4: Design Records', due: 'May 16', status: 'normal', assignees: ['Alex R.', 'David K.'] },
    { id: 5, title: 'Review Gate 0 Documentation - Omega Sedan', due: 'Today', status: 'urgent', assignees: ['Sarah J.'] },
    { id: 6, title: 'Approve ECO-4105: Chassis Modification', due: 'Tomorrow', status: 'normal', assignees: ['Alex R.', 'David K.'] },
    { id: 7, title: 'Sign-off IP67 Test Results', due: 'May 18', status: 'normal', assignees: ['Alex R.'] },
    { id: 8, title: 'Upload Dimensional Report Element 9', due: 'May 19', status: 'normal', assignees: ['Mike R.', 'Sarah J.'] },
    { id: 9, title: 'Preparation for Gate 3 - Delta Pickup', due: 'May 20', status: 'urgent', assignees: ['David K.'] },
    { id: 10, title: 'Review Lower Chassis Castings', due: 'May 21', status: 'normal', assignees: ['Alex R.'] },
    { id: 11, title: 'Approve ECO-4122: Inverter Unit Update', due: 'May 22', status: 'normal', assignees: ['Alex R.', 'Mike R.'] },
    { id: 12, title: 'Update DVP&R for Delta Pickup Payload Test', due: 'May 25', status: 'normal', assignees: ['Sarah J.'] },
  ]

  const programs = [
    { id: 'alpha-suv', name: 'Alpha SUV (P-2025)', gate: 'Gate 2', status: 'ON TRACK', progress: 65, color: 'bg-green-500' },
    { id: 'omega-sedan', name: 'Omega Sedan EV', gate: 'Gate 0', status: 'PLANNING', progress: 15, color: 'bg-gray-400' },
    { id: 'delta-pickup', name: 'Delta Pickup', gate: 'Gate 3', status: 'AT RISK', progress: 82, color: 'bg-amber-500' },
    { id: 'sigma-compact', name: 'Sigma Compact', gate: 'Gate 1', status: 'DELAYED', progress: 40, color: 'bg-red-500' },
    { id: 'gamma-hatch', name: 'Gamma Hatchback', gate: 'Gate 1', status: 'ON TRACK', progress: 45, color: 'bg-green-500' },
    { id: 'epsilon-van', name: 'Epsilon Van', gate: 'Gate 0', status: 'PLANNING', progress: 5, color: 'bg-gray-400' },
    { id: 'zeta-coupe', name: 'Zeta Coupe', gate: 'Gate 2', status: 'AT RISK', progress: 55, color: 'bg-amber-500' },
    { id: 'theta-suv', name: 'Theta SUV', gate: 'Gate 4', status: 'ON TRACK', progress: 95, color: 'bg-green-500' },
    { id: 'iota-truck', name: 'Iota Truck EV', gate: 'Gate 1', status: 'DELAYED', progress: 30, color: 'bg-red-500' },
    { id: 'kappa-sedan', name: 'Kappa Sedan', gate: 'Gate 2', status: 'ON TRACK', progress: 70, color: 'bg-green-500' },
    { id: 'lambda-sport', name: 'Lambda Sport', gate: 'Gate 0', status: 'PLANNING', progress: 10, color: 'bg-gray-400' },
    { id: 'mu-crossover', name: 'Mu Crossover', gate: 'Gate 3', status: 'ON TRACK', progress: 85, color: 'bg-green-500' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Engineering Overview</h1>
        <p className="text-text-secondary">Welcome back, Alex. Here is what is happening across your programs today.</p>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Open ECOs" value="12" icon={FileEdit} color="bg-accent" trend="+2 this week" path="/engineering-change" />
        <KPICard title="Pending Gates" value="08" icon={CheckCircle2} color="bg-accent" path="/gate-approvals" />
        <KPICard title="DVP&R Pass Rate" value="94.2%" icon={CheckCircle2} color="bg-accent" path="/dvpr" />
        <KPICard title="Overdue Actions" value="05" icon={AlertTriangle} color="bg-red-500" path="/tasks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-primary">My Tasks</h2>
            <Link to="/tasks" className="text-accent text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="card divide-y divide-gray-100">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "p-4 flex items-center gap-4 hover:bg-primary transition-colors cursor-pointer group",
                  completedTasks.includes(task.id) && "opacity-50"
                )}
                onClick={() => navigate('/tasks')}
              >
                <input 
                  type="checkbox" 
                  checked={completedTasks.includes(task.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleTaskToggle(task.id, task.title)
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent cursor-pointer" 
                />
                <div className="flex-1">
                  <h4 className={cn(
                    "text-sm font-bold text-text-primary group-hover:text-accent transition-colors",
                    completedTasks.includes(task.id) && "line-through text-text-secondary"
                  )}>{task.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <p className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      task.status === 'urgent' && !completedTasks.includes(task.id) ? "text-red-500" : "text-text-secondary"
                    )}>
                      Due {task.due}
                    </p>
                    <div className="flex -space-x-1.5" title="Assignees">
                      {task.assignees.map((assignee, i) => (
                        <div key={i} title={assignee} className="w-5 h-5 rounded-full border-2 border-white bg-surface flex items-center justify-center text-[8px] font-bold text-text-secondary shadow-sm">
                          {assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <MoreHorizontal size={18} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links & Activity */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/engineering-change')} 
                className="card p-4 flex flex-col items-center gap-2 hover:border-accent transition-all group w-full"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Plus size={20} />
                </div>
                <span className="text-sm font-bold">New ECO</span>
              </button>
              <div className="w-full relative">
                <input 
                  type="file" 
                  id="upload-test" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      toast({
                        title: 'Test Uploaded',
                        message: `Successfully uploaded ${e.target.files[0].name}`,
                        kind: 'success'
                      });
                      e.target.value = '';
                    }
                  }} 
                />
                <label 
                  htmlFor="upload-test" 
                  className="card p-4 flex flex-col items-center gap-2 hover:border-accent transition-all group w-full cursor-pointer m-0"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <Upload size={20} />
                  </div>
                  <span className="text-sm font-bold">Upload Test</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
            <div className="card p-4 space-y-6">
              {[
                { user: 'Sarah J.', action: 'submitted ECO-4092', time: '2h ago', path: '/engineering-change' },
                { user: 'Mike R.', action: 'completed Gate 1 Review', time: '4h ago', path: '/gate-approvals' },
                { user: 'David K.', action: 'uploaded DVP&R results', time: '6h ago', path: '/dvpr' },
                { user: 'Alex R.', action: 'approved BOM changes for Alpha SUV', time: '1d ago', path: '/bom' },
                { user: 'Sarah J.', action: 'created PPAP documentation request', time: '1d ago', path: '/apqp/PRG-8042' },
                { user: 'Mike R.', action: 'updated Thermal Pad Interface CAD', time: '2d ago', path: '/dashboard' },
                { user: 'David K.', action: 'resolved Quality Issue #402', time: '2d ago', path: '/dashboard' },
                { user: 'Alex R.', action: 'signed off on IP67 Test Results', time: '3d ago', path: '/dvpr' },
                { user: 'Sarah J.', action: 'initiated Gate 2 preparation', time: '3d ago', path: '/gate-approvals' },
              ].map((activity, i) => (
                <div 
                  key={i} 
                  className="flex gap-3 cursor-pointer group"
                  onClick={() => navigate(activity.path)}
                >
                  <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold group-hover:bg-accent group-hover:text-white transition-colors">SJ</div>
                  <div>
                    <p className="text-xs text-text-primary">
                      <span className="font-bold group-hover:text-accent">{activity.user}</span> {activity.action}
                    </p>
                    <span className="text-[10px] text-text-secondary uppercase font-bold">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Program Health Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-primary">Program Health</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary border-b border-border-dark">
                <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Program Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Current Gate</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">% Complete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {programs.map((program, i) => (
                <tr 
                  key={i} 
                  className="hover:bg-primary transition-colors cursor-pointer group"
                  onClick={() => navigate(`/programs/${program.id}/timeline`)}
                >
                  <td className="px-6 py-4 font-bold text-text-primary group-hover:text-accent transition-colors">{program.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary font-medium">{program.gate}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold",
                      program.status === 'ON TRACK' ? "bg-green-100 text-green-600" :
                      program.status === 'AT RISK' ? "bg-amber-100 text-amber-600" :
                      program.status === 'DELAYED' ? "bg-red-100 text-red-600" :
                      "bg-surface text-text-secondary"
                    )}>
                      {program.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000", program.color)} style={{ width: `${program.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-text-primary w-8">{program.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
