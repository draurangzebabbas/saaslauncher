import { useState } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { NotificationsPopover } from '../notifications/NotificationsPopover';

type Props = {
  toggleSidebar: () => void;
};

export function TopBar({ toggleSidebar }: Props) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Extract the page title from the current path
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Handle special cases
    if (path === '/dashboard' || path === '/') return 'Dashboard';
    if (path === '/projects') return 'Your Projects';
    if (path === '/templates') return 'Templates';
    if (path === '/resources') return 'Resource Library';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/project/')) {
      if (path.includes('/phase1')) return 'Phase 1: Research & Planning';
      if (path.includes('/phase2')) return 'Phase 2: Build';
      if (path.includes('/phase3')) return 'Phase 3: Marketing & Launch';
      return 'Project Overview';
    }
    
    // Fallback for other routes
    return path.split('/').pop()?.replace('-', ' ') || 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center border-b border-neutral-200 bg-white px-4">
      <button
        onClick={toggleSidebar}
        className="mr-4 block md:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 text-lg font-medium">{getPageTitle()}</div>

      <div className="relative mx-4 hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          placeholder="Search..."
          className="h-9 rounded-md border border-neutral-300 bg-neutral-50 pl-9 pr-4 text-sm focus:border-[#007a33] focus:outline-none focus:ring-1 focus:ring-[#007a33]"
        />
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="relative rounded-full p-2"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          {notificationsOpen && (
            <NotificationsPopover 
              onClose={() => setNotificationsOpen(false)} 
            />
          )}
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={16} className="text-neutral-600" />
              )}
            </div>
          </Button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
              <div className="border-b border-neutral-200 px-4 py-2">
                <p className="font-medium">{user?.user_metadata?.name || user?.email}</p>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>
              <div className="py-1">
                <a 
                  href="/settings/profile" 
                  className="block px-4 py-2 text-sm hover:bg-neutral-100"
                >
                  My Profile
                </a>
                <a 
                  href="/settings/collaborators" 
                  className="block px-4 py-2 text-sm hover:bg-neutral-100"
                >
                  Invite Collaborator
                </a>
              </div>
              <div className="border-t border-neutral-200 py-1">
                <button 
                  onClick={() => signOut()}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-100"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}