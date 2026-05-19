import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, LogOut,
  Search as SearchIcon, Command
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn, Badge } from '../ui';

export default function Topbar() {
  const navigate = useNavigate();
  const {
    currency, setCurrency, CURRENCIES,
    notifications, unreadCount, markAllRead, markRead,
    user, logout
  } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [search, setSearch] = useState('');
  const notifRef = useRef(null);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-border-dark bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <label htmlFor="scm-topbar-search" className="sr-only">Search</label>
          <input
            id="scm-topbar-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search POs, PRs, suppliers... (Cmd+K)"
            className="w-full bg-primary border border-border-dark rounded-xl pl-10 pr-14 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-surface border border-border-dark rounded text-[10px] text-text-secondary font-bold">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Currency Switcher */}
        <div className="flex items-center bg-primary border border-border-dark rounded-xl p-1">
          {Object.entries(CURRENCIES).map(([code, config]) => (
            <button
              key={code}
              onClick={() => setCurrency(code)}
              className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-black transition-all",
                currency === code ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 bg-primary border border-border-dark rounded-xl text-text-secondary hover:text-accent transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-surface border border-border-dark rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-border-dark flex justify-between items-center bg-primary/20">
                <h3 className="font-bold text-text-primary text-sm tracking-tight">Notifications</h3>
                <button onClick={markAllRead} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Mark all read</button>
              </div>
              <div className="max-h-96 overflow-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-secondary">No notifications yet.</div>
                ) : (
                  notifications.slice(0, 12).map((notif) => (
                    <button
                      key={notif.id}
                      type="button"
                      className={cn(
                        'w-full text-left p-4 border-b border-border-dark hover:bg-primary transition-colors',
                        !notif.read && 'bg-accent/5'
                      )}
                      onClick={() => {
                        markRead(notif.id);
                        if (notif.actionPath) navigate(notif.actionPath);
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={cn('text-xs font-bold', notif.read ? 'text-text-secondary' : 'text-text-primary')}>{notif.title}</p>
                        <span className="text-[9px] text-text-secondary font-medium">
                          {notif.timestamp
                            ? new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-tight">{notif.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-border-dark mx-2"></div>

        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Assigned Project</span>
          <Badge variant="success">AutoSCM Enterprise</Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-col items-end hidden md:flex">
            <span className="text-sm font-black text-text-primary leading-none">{user?.name ?? 'Guest'}</span>
            <Badge variant="accent" className="mt-1">
              {user?.role ?? '—'}{user?.designation ? ` — ${user.designation}` : ''}
            </Badge>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 bg-danger/10 text-danger rounded-xl hover:bg-danger/20 transition-all border border-danger/20 group"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
