import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, Lock, User, ArrowRight, ShieldCheck, Activity } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { findDemoUser } from '../lib/demoUsers'
import { useToast } from '../components/ui/Toast'

export function LoginPage() {
  const [username, setUsername] = useState('manager')
  const [password, setPassword] = useState('123')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)
    await new Promise((r) => setTimeout(r, 400))
    try {
      const found = findDemoUser(username, password)
      if (!found) throw new Error('Invalid credentials')
      const { username: _u, password: _p, ...session } = found
      login(session)
      toast('Welcome back to AutoMFG', 'success')
      navigate('/operations', { replace: true })
    } catch (_err) {
      setErrorMsg('Invalid credentials. Try manager / 123.')
      toast('Invalid credentials', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 mfg-theme font-sans">
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200/60">
        {/* Left panel (Brand/Dark) */}
        <div className="p-12 hidden lg:flex flex-col justify-between bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(46,125,50,0.25),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(46,125,50,0.15),transparent_50%)] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <LayoutGrid className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-white leading-none">
                  Auto<span className="text-accent">MFG</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Enterprise Control
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-black text-white leading-[1.15] tracking-tight mb-6">
              Next-Generation
              <br />
              Manufacturing Execution.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-md">
              Unify your shop floor with real-time OEE, reactive Andon management, and complete product traceability.
            </p>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/20 text-accent">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white">Shift-Based RBAC</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Strict role enforcement for Plant Managers, Shift Leads, and Operators.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-success/20 text-success">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white">Full Traceability</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Track every component and quality event per VIN from start to EOL.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel (Light/Form) */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-[380px] mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure Access</h2>
              <p className="text-slate-500 text-sm">Enter your credentials to authenticate.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="username" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {import.meta.env.DEV && (
              <div className="mt-12 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Demo accounts
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Plant Manager', user: 'plantmgr' },
                    { label: 'Production Manager', user: 'manager' },
                    { label: 'Shift Lead', user: 'lead' },
                    { label: 'Line Leader', user: 'leader' },
                    { label: 'Operator', user: 'operator' },
                  ].map((row) => (
                    <div key={row.user} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">{row.label}</span>
                      <span className="font-mono text-slate-900 font-bold">{row.user}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <p className="text-[10px] text-slate-500 text-center">
                    Password for all accounts: <strong className="text-slate-900 font-mono text-xs">123</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
