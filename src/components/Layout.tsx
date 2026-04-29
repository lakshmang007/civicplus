import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Button } from './ui/button';
import { 
  Home, 
  Vote, 
  MessageSquare, 
  Users, 
  PlusCircle, 
  User as UserIcon,
  LogOut,
  LogIn,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface LayoutProps {
  user: any;
}

export default function Layout({ user }: LayoutProps) {
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success("Successfully logged in!");
    } catch (error) {
      toast.error("Login failed: " + (error as any).message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out.");
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Voter ID', path: '/voter-id', icon: Vote },
    { name: 'Problem Feed', path: '/feed', icon: MessageSquare },
    { name: 'Authorities', path: '/directory', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-[#1e293b] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-white flex flex-col p-5 shrink-0">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-lg">
            C
          </div>
          <span className="font-bold text-xl tracking-tight">CivicPulse</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path}>
              <div className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer
                ${location.pathname === item.path 
                  ? 'bg-slate-800 text-white border-l-4 border-accent' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
              `}>
                <item.icon size={18} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
          {user && (
            <Link to="/profile">
              <div className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer
                ${location.pathname === '/profile' 
                  ? 'bg-slate-800 text-white border-l-4 border-accent' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
              `}>
                <UserIcon size={18} />
                <span className="font-medium">Citizen Profile</span>
              </div>
            </Link>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col space-y-4">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0" />
                <div className="text-[10px] truncate max-w-[120px]">
                   <div className="font-bold text-slate-200">{user.displayName || 'User'}</div>
                   <div className="text-slate-500 font-mono">ID: {user.uid.slice(0, 8)}...</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleLogin} className="w-full rounded-lg bg-accent hover:bg-blue-700 text-white">
              <LogIn size={16} className="mr-2" />
              Sign In
            </Button>
          )}
          <div className="text-[10px] text-slate-600 font-mono">
            SYS_VERSION: 1.0.4<br />
            GEMINI_LINKED: TRUE
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <span className="text-neutral-400 uppercase tracking-tighter">City Overview:</span>
            <span className="text-accent">Bengaluru South</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-neutral-50 p-1 rounded-md border border-neutral-200 text-[10px] font-bold">
               <button className="px-2 py-1 rounded-sm">EN</button>
               <button className="px-2 py-1 rounded-sm bg-accent text-white">KN</button>
               <button className="px-2 py-1 rounded-sm">HI</button>
            </div>
            {user && (
              <Link to="/submit">
                <Button size="sm" className="rounded-md bg-accent text-white hover:bg-blue-700">
                  <PlusCircle size={16} className="mr-2" />
                  New Report
                </Button>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#f3f4f6]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
