import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Lock, User, ArrowRight, ShieldCheck, Info } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { findDemoUser, DEMO_USERS } from '../lib/demoUsers'
import { cn } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setTimeout(() => {
      const found = findDemoUser(username, password)
      if (!found) {
        setError('Invalid credentials. Check the user list below.')
        setIsLoading(false)
        return
      }
      const { username: _u, password: _p, ...session } = found
      login(session)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    }, 600)
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6 font-sans scm-theme">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,148,136,0.12),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-surface/30 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative z-10">
        <div className="p-12 hidden lg:flex flex-col justify-between bg-gradient-to-br from-accent/10 to-transparent border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-blue-700 flex items-center justify-center shadow-lg shadow-accent/20">
                <LayoutDashboard className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-white leading-none">
                  Auto<span className="text-accent">SCM</span>
                </span>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">
                  Auto-Suite Platform
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-black text-white leading-[1.1] mb-6">
              Precision Logistics &amp;<br />
              <span className="text-accent">Real-time Visibility.</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-md">
              The unified control tower for automotive supply chains. Manage PRs, RFQs, POs, and Supplier Performance in one secure environment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <ShieldCheck className="w-6 h-6 text-accent mb-2" />
              <p className="text-white font-bold text-sm">Secure RBAC</p>
              <p className="text-text-secondary text-xs mt-1">Role-based access control for all modules.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <ArrowRight className="w-6 h-6 text-accent mb-2" />
              <p className="text-white font-bold text-sm">Live Audit</p>
              <p className="text-text-secondary text-xs mt-1">Full traceability on every approval workflow.</p>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-[360px] mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">Welcome back.</h2>
              <p className="text-text-secondary mt-2">Sign in to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="scm-username" className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Username or email</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                  <input
                    id="scm-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="scm-password" className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                  <input
                    id="scm-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-2 text-danger text-xs font-medium">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full h-12 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 active:scale-[0.98]',
                  isLoading && 'opacity-70 cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {import.meta.env.DEV && (
              <div className="mt-12 p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Demo accounts (password: 123)
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto pr-1">
                  {DEMO_USERS.map((u) => (
                    <div key={u.id} className="text-[10px] flex flex-col">
                      <span className="text-white/60 font-medium">
                        {u.role}: <span className="text-white font-bold">{u.username}</span>
                      </span>
                      <span className="text-white/30 italic truncate">{u.designation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
