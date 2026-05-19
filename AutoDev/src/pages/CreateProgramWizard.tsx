import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  X, 
  Check, 
  Users, 
  Calendar, 
  Zap, 
  Info,
  Search,
  Plus,
  Trash2
} from 'lucide-react'
import { cn } from '../utils/cn'


const steps = [
  { id: 1, title: 'Basic Info', icon: Info },
  { id: 2, title: 'Team', icon: Users },
  { id: 3, title: 'Milestones', icon: Calendar },
  { id: 4, title: 'Integration', icon: Zap },
]

const CreateProgramWizard = () => {
  const navigate = useNavigate()
  
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    name: '',
    code: '',
    modelYear: '',
    platform: '',
    description: '',
    team: {} as any,
    milestones: {} as any
  })

  const nextStep = () => {
    if (currentStep === 1 && !formData.name) {
      console.log('Program Name is required', 'error')
      return
    }
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleSaveDraft = () => {
    console.log('Draft saved successfully', 'info')
  }

  const handleSubmit = () => {
    console.log('Program created successfully!', 'success')
    navigate('/programs')
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/programs')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-bold text-sm">
          <X size={18} /> Cancel
        </button>
        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  currentStep === step.id ? "bg-sidebar text-white shadow-lg" : 
                  currentStep > step.id ? "bg-accent text-white" : "bg-surface text-text-secondary"
                )}>
                  {currentStep > step.id ? <Check size={16} /> : step.id}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  currentStep === step.id ? "text-text-primary" : "text-text-secondary"
                )}>
                  {step.title}
                </span>
              </div>
              {step.id < 4 && <div className="w-12 h-px bg-gray-200 mx-2" />}
            </React.Fragment>
          ))}
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="card p-10 min-h-[500px] flex flex-col">
        {currentStep === 1 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Program Definition</h2>
              <p className="text-text-secondary">Define the core identifiers and attributes for the new vehicle development program.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest">Program Name*</label>
                <input 
                  type="text" 
                  placeholder="e.g. NextGen SUV 2026" 
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full bg-primary border border-border-dark rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest">Internal Code*</label>
                <div className="flex">
                  <span className="bg-surface border border-r-0 border-border-dark rounded-l-lg px-4 py-3 text-text-secondary font-bold">PRG-</span>
                  <input type="text" placeholder="8042" className="flex-1 bg-primary border border-border-dark rounded-r-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest">Target Model Year*</label>
                <select className="w-full bg-primary border border-border-dark rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
                  <option>Select Year</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest">Platform Architecture</label>
                <select className="w-full bg-primary border border-border-dark rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
                  <option>Select Platform Base</option>
                  <option>Modular EV (MEV-1)</option>
                  <option>Unibody L (UL-4)</option>
                  <option>Ladder Frame X</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest">Program Scope & Objectives</label>
                <textarea rows={4} placeholder="Briefly describe the goals, target market, and key innovations for this program..." className="w-full bg-primary border border-border-dark rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Team Assignment</h2>
              <p className="text-text-secondary">Assign key leadership roles and functional leads to the program.</p>
            </div>

            <div className="relative mb-6">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input type="text" placeholder="Search users by name or role..." className="w-full bg-primary border border-border-dark rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent/20" />
            </div>

            <div className="space-y-4">
              {[
                { role: 'Chief Engineer', mandatory: true },
                { role: 'Program Manager', mandatory: true },
                { role: 'Lead Design Engineer', mandatory: true },
                { role: 'Validation Lead', mandatory: false },
                { role: 'Quality Engineer', mandatory: false },
              ].map((role, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border-dark rounded-lg bg-primary/30">
                  <div className="w-40 font-bold text-sm text-text-primary flex items-center gap-2">
                    {role.role}
                    {role.mandatory && <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[8px] rounded font-black uppercase">Required</span>}
                  </div>
                  <div className="flex-1">
                    <select className="w-full bg-surface border border-border-dark rounded px-3 py-2 text-sm outline-none focus:border-accent">
                      <option>Select Assignee...</option>
                      <option>Alex Rivera</option>
                      <option>Sarah Jenkins</option>
                      <option>Michael Chen</option>
                    </select>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 text-accent text-sm font-bold mt-4 hover:underline">
                <Plus size={16} /> Add optional team members
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Milestones</h2>
              <p className="text-text-secondary">Set target dates for key APQP gates and project milestones.</p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-surface rounded text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                <div className="col-span-4">Milestone Name</div>
                <div className="col-span-4">Target Date</div>
                <div className="col-span-3">Responsible</div>
                <div className="col-span-1"></div>
              </div>
              {['Gate 0: Concept Initiation', 'Gate 1: Product Concept', 'Gate 2: Design Verification', 'Gate 3: Process Design', 'Gate 4: Product & Process Val', 'Gate 5: Launch'].map((gate, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-50">
                  <div className="col-span-4 text-sm font-bold text-text-primary">{gate}</div>
                  <div className="col-span-4">
                    <input type="date" className="w-full bg-primary border border-border-dark rounded px-3 py-2 text-sm" />
                  </div>
                  <div className="col-span-3">
                    <select className="w-full bg-primary border border-border-dark rounded px-3 py-2 text-sm">
                      <option>Select...</option>
                    </select>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 text-accent text-sm font-bold mt-4 hover:underline">
                <Plus size={16} /> Add Custom Milestone
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Integration</h2>
              <p className="text-text-secondary">Connect the program to external engineering and enterprise systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Teamcenter PDM sync', desc: 'Sync engineering data and CAD structures', status: 'connected' },
                { name: 'SAP ERP link', desc: 'Financial tracking and resource planning', status: 'not-connected' },
                { name: 'JIRA test case tracking', desc: 'Automated sync of validation tasks', status: 'not-connected' },
                { name: 'Calendar auto-scheduling', desc: 'Auto-sync milestones to team calendars', status: 'connected' },
              ].map((item, i) => (
                <div key={i} className="p-6 border border-border-dark rounded-xl bg-primary/50 flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="font-bold text-text-primary">{item.name}</h4>
                    <p className="text-xs text-text-secondary">{item.desc}</p>
                    {item.status === 'connected' && <span className="text-[10px] font-bold text-accent uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 bg-accent/90 rounded-full" /> Connected</span>}
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.status === 'connected'} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border-dark flex justify-between items-center">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all",
              currentStep === 1 ? "text-gray-300 cursor-not-allowed" : "text-text-primary hover:bg-surface"
            )}
          >
            <ArrowLeft size={18} /> Previous Step
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-text-secondary hover:bg-surface transition-all"
            >
              <Save size={18} /> Save Draft
            </button>
            {currentStep < 4 ? (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-teal-500/20"
              >
                Next: {steps[currentStep].title} <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-lg font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-teal-500/20"
              >
                Submit & Create Program <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProgramWizard
