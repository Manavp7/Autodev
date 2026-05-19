import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, FileSpreadsheet, 
  ShoppingCart, PackageCheck, TrendingUp, AlertTriangle, 
  FileSignature, ChevronLeft, ChevronRight, Settings 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const navItems = [
  { name: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Supplier Management', path: '/suppliers', icon: Users },
  { name: 'Purchase Requisitions', path: '/prs', icon: FileText },
  { name: 'RFQ / Tenders', path: '/rfqs', icon: FileSpreadsheet },
  { name: 'Purchase Orders', path: '/pos', icon: ShoppingCart },
  { name: 'Goods Receipt (GRN)', path: '/grn', icon: PackageCheck },
  { name: 'Supplier Performance', path: '/performance', icon: TrendingUp },
  { name: 'Shortage Management', path: '/shortages', icon: AlertTriangle, alert: true },
  { name: 'Contract Management', path: '/contracts', icon: FileSignature },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div className={cn(
      "flex flex-col bg-sidebar-bg border-r border-border-dark transition-all duration-300 z-20 shrink-0",
      isOpen ? "w-64" : "w-20"
    )}>
      {/* Logo Area */}
      <div className="flex-between h-20 px-4 border-b border-border-dark shrink-0">
        <div className={cn("flex items-center gap-3 overflow-hidden", !isOpen && "justify-center")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-text-primary leading-none">Auto<span className="text-accent">SCM</span></span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">Enterprise Suite</span>
            </div>
          )}
        </div>
        {/* Toggle Button */}
        {isOpen && (
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-surface rounded text-text-secondary hover:text-text-primary shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2 custom-scrollbar">
        {!isOpen && (
          <div className="flex-center mb-4">
             <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-surface rounded text-text-secondary hover:text-text-primary">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!isOpen ? item.name : undefined}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all relative group",
              isActive 
                ? "bg-accent/15 text-accent font-bold shadow-sm" 
                : "text-text-secondary hover:bg-surface hover:text-text-primary"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", item.alert && "text-warning")} />
            {isOpen && (
              <span className="truncate text-[13px] tracking-tight">{item.name}</span>
            )}
            {/* Alert dot */}
            {item.alert && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border-dark text-text-primary text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-border-dark shrink-0">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-500 shrink-0 border-2 border-surface flex items-center justify-center text-text-primary font-bold">
            RK
          </div>
          {isOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-text-primary truncate">Rajesh Kumar</span>
              <span className="text-xs text-text-secondary truncate">Senior Buyer</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
