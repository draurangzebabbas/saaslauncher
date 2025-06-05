import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProjectPhase1 from './pages/ProjectPhase1';

function App() {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Hide sidebar for auth and landing pages
  const showSidebar = !(
    location.pathname === '/' || 
    location.pathname === '/auth'
  );

  // Redirect unauthenticated users to auth page
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007a33]"></div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/auth" />;
    }
    
    return <>{children}</>;
  };

  // Adjust body class based on sidebar state
  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add('has-sidebar');
    } else {
      document.body.classList.remove('has-sidebar');
    }
  }, [showSidebar]);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {showSidebar && (
        <>
          <Sidebar />
          <div className={`flex flex-1 flex-col transition-all ${isSidebarOpen ? 'ml-[240px]' : 'ml-[60px]'}`}>
            <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1">
              <Routes>
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/project/:projectId/phase1" 
                  element={
                    <ProtectedRoute>
                      <ProjectPhase1 />
                    </ProtectedRoute>
                  } 
                />
                {/* Other protected routes will go here */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </>
      )}

      {!showSidebar && (
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;