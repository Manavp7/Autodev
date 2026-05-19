import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Lock, User, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { findDemoUser, DEMO_USERS } from '../lib/demoUsers'
import { cn } from '../utils/cn'

const loginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
})

type LoginFields = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: { pathname?: string } } }
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ resolver: zodResolver(loginSchema), defaultValues: { username: '', password: '' } })

  useEffect(() => {
    document.title = 'AutoDev — Sign in'
  }, [])

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />
  }

  const onSubmit = async (values: LoginFields) => {
    // Simulate latency for the spinner.
    await new Promise((r) => setTimeout(r, 400))
    const found = findDemoUser(values.username, values.password)
    if (!found) {
      setError('password', { message: 'Invalid credentials.' })
      return
    }
    const { username: _u, password: _p, ...session } = found
    login(session)
    navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6 dev-theme">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-surface/30 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative z-10">
        {/* Left panel */}
        <div className="p-12 hidden lg:flex flex-col justify-between bg-gradient-to-br from-accent/10 to-transparent border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-blue-700 flex items-center justify-center shadow-lg shadow-accent/20">
                <LayoutDashboard className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-white leading-none">
                  Auto<span className="text-accent">Dev</span>
                </span>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mt-1">
                  Auto-Suite Platform v1.0
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white leading-[1.1] mb-6">
              Engineering your vehicle
              <br />
              <span className="text-accent">development lifecycle.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              Gate-based APQP workflows, real-time BOM traceability, DVP&amp;R test management,
              and ISO 26262 compliance — in one platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <ShieldCheck className="w-6 h-6 text-accent mb-2" />
              <p className="text-white font-bold text-sm">Gate-based APQP</p>
              <p className="text-white/70 text-xs mt-1">Quality ensured at every stage.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <Zap className="w-6 h-6 text-accent mb-2" />
              <p className="text-white font-bold text-sm">Real-time traceability</p>
              <p className="text-white/70 text-xs mt-1">Components, requirements, tests — linked.</p>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-[360px] mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">Welcome back.</h2>
              <p className="text-white/70 mt-2">Sign in to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">
                  Username or email
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-accent transition-colors" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    aria-invalid={!!errors.username}
                    {...register('username')}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                  />
                </div>
                {errors.username && (
                  <p className="text-danger text-xs ml-1">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-accent transition-colors" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="text-danger text-xs ml-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-12 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 active:scale-[0.98]',
                  isSubmitting && 'opacity-70 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials — DEV ONLY */}
            {import.meta.env.DEV && (
              <div className="mt-10 p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Demo accounts (password: 123)
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto pr-1">
                  {DEMO_USERS.slice(0, 12).map((u) => (
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
