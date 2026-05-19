import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <Compass size={64} className="text-accent mb-6" />
      <h1 className="text-4xl font-black text-text-primary tracking-tight">404</h1>
      <p className="mt-2 text-text-secondary max-w-md">
        That route doesn’t exist in the platform. Use the sidebar to navigate, or jump back to your dashboard.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition"
      >
        Return to dashboard
      </Link>
    </div>
  )
}
