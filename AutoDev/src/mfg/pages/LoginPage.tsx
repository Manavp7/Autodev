import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, Lock, User, ArrowRight, ShieldCheck, Activity } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '../components/ui/Toast'

export function LoginPage() {
  const [username, setUsername] = useState('manager')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600))
    
    try {
      await login(username, password)
      toast('Welcome back to AutoMFG Enterprise', 'success')
      navigate('/operations')
    } catch (err) {
      toast('Invalid credentials. Try manager/password123', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050B18] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(46,125,50,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-[#0A0F1E]/80 backdrop-blur-xl border border-border-dark rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0D1526] to-[#0A0F1E] border-r border-border-dark relative overflow-hidden">
          {/* Decorative mesh */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] mix-blend-overlay" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-forest-700 flex items-center justify-center shadow-lg shadow-accent/20">
                <LayoutGrid className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-3xl tracking-tighter text-white leading-none">
                  Auto<span className="text-accent">MFG</span>
                </span>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">
                  Enterprise Control
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Next-Generation<br />Manufacturing Execution.
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-12 max-w-md">
              Unify your shop floor with real-time OEE, reactive Andon management, and complete product traceability.
            </p>

            <div className="space-y-4">
              <div className="glass p-5 rounded-2xl border-white/5 bg-white/5">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 rounded-lg bg-accent/20 text-accent">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white">Shift-Based RBAC</h3>
                </div>
                <p className="text-sm text-text-secondary">Strict role enforcement for Plant Managers, Shift Leads, and Operators.</p>
              </div>

              <div className="glass p-5 rounded-2xl border-white/5 bg-white/5">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 rounded-lg bg-success/20 text-success">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white">Full Traceability</h3>
                </div>
                <p className="text-sm text-text-secondary">Track every component and quality event per VIN from start to EOL.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center relative bg-[#0A0F1E]">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Secure Access</h2>
              <p className="text-text-secondary text-sm">Enter your credentials to authenticate.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-all focus:bg-white/10"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-all focus:bg-white/10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl py-3.5 font-bold transition-all shadow-[0_0_20px_rgba(46,125,50,0.3)] hover:shadow-[0_0_30px_rgba(46,125,50,0.5)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-12 p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                System Access Registry
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm p-2 rounded bg-white/5">
                  <span className="text-white/70">Plant Manager</span>
                  <span className="font-mono text-accent font-bold">manager</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded bg-white/5">
                  <span className="text-white/70">Shift Lead</span>
                  <span className="font-mono text-accent font-bold">lead</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded bg-white/5">
                  <span className="text-white/70">Operator</span>
                  <span className="font-mono text-accent font-bold">operator</span>
                </div>
              </div>
              <p className="text-[10px] text-text-secondary mt-3 text-center opacity-70">
                Password for all accounts: <strong className="text-white font-mono">password123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
