import { useSearchParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'

interface Hit {
  title: string
  subtitle: string
  path: string
}

const fakeIndex: Hit[] = [
  { title: 'Programs Portfolio',     subtitle: 'AutoDev', path: '/programs' },
  { title: 'Engineering Change',     subtitle: 'AutoDev', path: '/engineering-change' },
  { title: 'BOM Hub',                subtitle: 'AutoDev', path: '/bom' },
  { title: 'DVP&R',                  subtitle: 'AutoDev', path: '/dvpr' },
  { title: 'APQP / PPAP',            subtitle: 'AutoDev', path: '/gate-approvals' },
  { title: 'Documents',              subtitle: 'AutoDev', path: '/documents' },
  { title: 'Production Planning',    subtitle: 'AutoMFG', path: '/mfg/planning' },
  { title: 'Work Orders',            subtitle: 'AutoMFG', path: '/mfg/work-orders' },
  { title: 'Quality Gate',           subtitle: 'AutoMFG', path: '/mfg/quality-gate' },
  { title: 'OEE Analytics',          subtitle: 'AutoMFG', path: '/mfg/oee' },
  { title: 'Suppliers',               subtitle: 'AutoSCM', path: '/scm/suppliers' },
  { title: 'Purchase Requisitions',   subtitle: 'AutoSCM', path: '/scm/prs' },
  { title: 'RFQs',                    subtitle: 'AutoSCM', path: '/scm/rfqs' },
  { title: 'Purchase Orders',         subtitle: 'AutoSCM', path: '/scm/pos' },
  { title: 'Goods Receipt',           subtitle: 'AutoSCM', path: '/scm/grn' },
  { title: 'Shortages',               subtitle: 'AutoSCM', path: '/scm/shortages' },
  { title: 'Contracts',               subtitle: 'AutoSCM', path: '/scm/contracts' },
]

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim().toLowerCase()
  const hits = q
    ? fakeIndex.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.subtitle.toLowerCase().includes(q)
      )
    : []

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Search size={22} className="text-accent" />
        <h1 className="text-2xl font-bold text-text-primary">
          Results for <span className="text-accent">{q || '—'}</span>
        </h1>
      </div>
      {!q && (
        <p className="text-text-secondary text-sm">
          Start typing in the top-bar search to look across modules.
        </p>
      )}
      {q && hits.length === 0 && (
        <p className="text-text-secondary text-sm">No matches for "{q}".</p>
      )}
      <ul className="divide-y divide-border-dark border border-border-dark rounded-xl overflow-hidden">
        {hits.map((h) => (
          <li key={h.path}>
            <Link
              to={h.path}
              className="flex items-center justify-between px-5 py-4 hover:bg-surface transition"
            >
              <div>
                <p className="font-semibold text-text-primary">{h.title}</p>
                <p className="text-xs text-text-secondary uppercase tracking-wider">
                  {h.subtitle}
                </p>
              </div>
              <span className="text-xs text-accent font-mono">{h.path}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
