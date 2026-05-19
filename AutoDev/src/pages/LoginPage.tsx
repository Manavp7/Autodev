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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 dev-theme font-sans">
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200/60">
        {/* Left panel (Brand/Dark) */}
        <div className="p-12 hidden lg:flex flex-col justify-between bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(37,99,235,0.2),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(37,99,235,0.1),transparent_50%)] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <LayoutDashboard className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-white leading-none">
                  Auto<span className="text-accent">Dev</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Auto-Suite Platform v1.0
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white leading-[1.15] mb-6 tracking-tight">
              Engineering your vehicle
              <br />
              <span className="text-accent">development lifecycle.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Gate-based APQP workflows, real-time BOM traceability, DVP&amp;R test management,
              and ISO 26262 compliance — in one platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-accent mb-3" />
              <p className="text-white font-bold text-sm">Gate-based APQP</p>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Quality ensured at every stage.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Zap className="w-6 h-6 text-accent mb-3" />
              <p className="text-white font-bold text-sm">Real-time traceability</p>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Components, requirements, tests — linked.</p>
            </div>
          </div>
        </div>

        {/* Right panel (Light/Form) */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-[380px] mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 mt-2 text-sm">Sign in to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="username" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Username or email
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    aria-invalid={!!errors.username}
                    {...register('username')}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  />
                </div>
                {errors.username && (
                  <p className="text-danger text-xs">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="text-danger text-xs flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-12 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 active:scale-[0.98] mt-2',
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
              <div className="mt-10 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info className="w-3 h-3 text-accent" /> Demo accounts (password: 123)
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-h-48 overflow-y-auto pr-1">
                  {DEMO_USERS.slice(0, 12).map((u) => (
                    <div key={u.id} className="text-xs flex flex-col">
                      <span className="text-slate-500 font-medium">
                        {u.role}: <span className="text-slate-900 font-bold">{u.username}</span>
                      </span>
                      <span className="text-slate-400 text-[10px] truncate">{u.designation}</span>
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
