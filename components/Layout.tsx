import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, LogOut, ShieldCheck, Github } from 'lucide-react';
import { ApiService } from '../services/mockApi';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = ApiService.isAuthenticated();

  const handleLogout = () => {
    ApiService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 flex flex-col">
      {/* Header */}
      <header className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:text-amber-400 transition-colors group">
            <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800 group-hover:border-amber-500/50 transition-colors">
              <Terminal className="w-5 h-5 text-amber-500" />
            </div>
            <span className="tracking-tight">Hack<span className="text-amber-500">Pulse</span></span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium hover:text-amber-400 transition-colors ${location.pathname === '/' ? 'text-amber-400' : 'text-zinc-400'}`}>
              Browse
            </Link>
            
            {isAdmin ? (
              <>
                <Link to="/admin" className={`text-sm font-medium hover:text-amber-400 transition-colors ${location.pathname.includes('/admin') ? 'text-amber-400' : 'text-zinc-400'}`}>
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm bg-zinc-900 border border-zinc-700 hover:border-red-500/50 hover:text-red-400 text-zinc-300 px-3 py-1.5 rounded-md transition-all"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 text-sm text-zinc-400 hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-8 text-center text-zinc-600 text-sm">
        <div className="container mx-auto px-4">
          <p className="mb-2">&copy; {new Date().getFullYear()} HackPulse. All rights reserved.</p>
          <div className="flex justify-center items-center space-x-4">
            <a href="#" className="hover:text-amber-500 transition-colors">About</a>
            <a href="#" className="hover:text-amber-500 transition-colors">API</a>
            <span className="flex items-center gap-1">
                 Powered by <Github size={12}/> Open Source
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};