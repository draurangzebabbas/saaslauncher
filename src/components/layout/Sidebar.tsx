import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileStack, 
  BookOpen, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

type SidebarLinkProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
};

const SidebarLink = ({ icon, label, to, isActive, isCollapsed }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={twMerge(
        'flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
        isActive 
          ? 'bg-[#007a33]/10 text-[#007a33] font-medium' 
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        isCollapsed && 'justify-center px-2'
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const links = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <FolderKanban size={20} />, label: 'Projects', to: '/projects' },
    { icon: <FileStack size={20} />, label: 'Templates', to: '/templates' },
    { icon: <BookOpen size={20} />, label: 'Resources', to: '/resources' },
    { icon: <Settings size={20} />, label: 'Settings', to: '/settings/profile' },
    { icon: <CreditCard size={20} />, label: 'Billing', to: '/settings/billing' },
    { icon: <HelpCircle size={20} />, label: 'Help & Docs', to: '/help' }
  ];

  return (
    <aside
      className={twMerge(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300',
        isCollapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      <div className="flex h-16 items-center px-4 border-b border-neutral-200">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-[#007a33]" />
            <span className="font-semibold text-lg">SaaS Launcher</span>
          </div>
        ) : (
          <LayoutDashboard className="h-6 w-6 text-[#007a33] mx-auto" />
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            icon={link.icon}
            label={link.label}
            to={link.to}
            isActive={location.pathname === link.to || location.pathname.startsWith(`${link.to}/`)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-neutral-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}