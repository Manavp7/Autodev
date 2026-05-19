import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Users, 
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ProgramCard = ({ program }: any) => {
  const navigate = useNavigate()
  return (
    <div className="card group hover:border-accent transition-all flex flex-col h-full hover:shadow-lg">
      <div className="p-5 border-b border-border-dark flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{program.platform}</span>
          <h3 className="text-lg font-black text-text-primary group-hover:text-accent transition-colors leading-tight">
            {program.name}
          </h3>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{program.id}</p>
        </div>
        <button className="text-gray-300 hover:text-text-primary transition-colors"><MoreVertical size={18} /></button>
      </div>
      
      <div className="p-6 flex-1 space-y-6">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
          <span className="text-text-secondary">Current Phase</span>
          <span className="text-text-primary">{program.phase}</span>
        </div>
        
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step} 
              className={cn(
                "h-1.5 flex-1 rounded-full",
                step <= program.currentStep ? "bg-accent" : "bg-surface"
              )} 
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">SOP Date</label>
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <Calendar size={14} className="text-accent" />
              {program.sop}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Team Size</label>
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <Users size={14} className="text-accent" />
              {program.teamSize} Engineers
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-primary/50 border-t border-border-dark flex gap-2">
        <button 
          onClick={() => navigate(`/programs/${program.id}/timeline`)}
          className="flex-1 py-2.5 bg-sidebar text-text-primary border border-border-dark rounded font-black text-[10px] uppercase tracking-widest hover:bg-surface transition-all shadow-sm flex items-center justify-center gap-2"
        >
          Timeline <ArrowRight size={14} />
        </button>
        <button 
          onClick={() => navigate(`/programs/${program.id}/gate/0`)}
          className="flex-1 py-2.5 bg-surface border border-border-dark text-text-primary rounded font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
        >
          Review Gates
        </button>
      </div>
    </div>
  )
}

const ProgramPortfolio = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedPlatform, setSelectedPlatform] = React.useState('All Platforms')

  const programs = [
    { id: 'PRG-8042', name: 'Alpha SUV 2026', platform: 'Electric Gen 2', phase: 'Product Design', currentStep: 2, sop: 'Sept 2025', teamSize: 42 },
    { id: 'PRG-2210', name: 'Omega Sedan EV', platform: 'Luxury Class', phase: 'Feasibility', currentStep: 1, sop: 'March 2026', teamSize: 28 },
    { id: 'PRG-9904', name: 'Delta Pickup X', platform: 'Heavy Duty', phase: 'Process Design', currentStep: 3, sop: 'Dec 2025', teamSize: 56 },
    { id: 'PRG-7711', name: 'Sigma Compact', platform: 'City Gen 3', phase: 'Concept Design', currentStep: 2, sop: 'June 2026', teamSize: 18 },
    { id: 'PRG-1022', name: 'Gamma Hatchback', platform: 'City Gen 3', phase: 'Product Design', currentStep: 2, sop: 'July 2025', teamSize: 32 },
    { id: 'PRG-3351', name: 'Epsilon Van', platform: 'Commercial', phase: 'Feasibility', currentStep: 1, sop: 'May 2026', teamSize: 24 },
    { id: 'PRG-4482', name: 'Zeta Coupe', platform: 'Luxury Class', phase: 'Process Design', currentStep: 3, sop: 'Jan 2026', teamSize: 45 },
    { id: 'PRG-5593', name: 'Theta SUV', platform: 'Electric Gen 2', phase: 'Product Design', currentStep: 2, sop: 'Aug 2025', teamSize: 38 },
    { id: 'PRG-6604', name: 'Iota Truck EV', platform: 'Heavy Duty', phase: 'Concept Design', currentStep: 1, sop: 'Nov 2026', teamSize: 60 },
    { id: 'PRG-7715', name: 'Kappa Sedan', platform: 'Electric Gen 2', phase: 'Product Validation', currentStep: 4, sop: 'Oct 2025', teamSize: 50 },
    { id: 'PRG-8826', name: 'Lambda Sport', platform: 'Luxury Class', phase: 'Feasibility', currentStep: 1, sop: 'Feb 2027', teamSize: 20 },
    { id: 'PRG-9937', name: 'Mu Crossover', platform: 'City Gen 3', phase: 'Process Design', currentStep: 3, sop: 'April 2026', teamSize: 40 },
  ]

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          program.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          program.platform.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'All Platforms' || program.platform === selectedPlatform
    
    return matchesSearch && matchesPlatform
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Program Portfolio</h1>
          <p className="text-text-secondary">Manage and track all vehicle product development programs.</p>
        </div>
        <Link to="/programs/new" className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20">
          <Plus size={20} /> New Program
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by Program Name, ID, or Platform..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border-dark rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent shadow-sm"
          />
        </div>
        <div className="flex gap-2 items-center bg-surface border border-border-dark rounded-xl px-4 shadow-sm focus-within:border-accent transition-colors">
          <Filter size={18} className="text-text-secondary" />
          <select 
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-transparent border-none py-3 text-sm font-bold text-text-primary outline-none cursor-pointer min-w-[160px]"
          >
            <option>All Platforms</option>
            <option>Electric Gen 2</option>
            <option>Luxury Class</option>
            <option>Heavy Duty</option>
            <option>City Gen 3</option>
            <option>Commercial</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
        
        {/* Placeholder for new program */}
        <Link to="/programs/new" className="card border-2 border-dashed border-border-dark flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-primary/50 transition-all opacity-60">
           <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-gray-300 mb-4 group-hover:scale-110 transition-transform">
             <Plus size={24} />
           </div>
           <h3 className="text-sm font-black text-text-secondary uppercase tracking-widest mb-1">Add New Program</h3>
           <p className="text-[10px] text-gray-300 font-bold max-w-[160px]">Follow the initiation wizard to launch a new vehicle cycle</p>
        </Link>
      </div>
    </div>
  )
}

export default ProgramPortfolio
