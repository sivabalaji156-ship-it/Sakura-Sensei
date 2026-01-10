
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Brain, 
  MessageCircle, 
  Headphones,
  Menu, 
  X,
  Zap,
  Award,
  LogOut,
  Type,
  Book,
  Repeat,
  MonitorPlay,
  TrendingUp,
  Sword
} from 'lucide-react';
import { UserProfile } from '../types';
import { BadgePopup } from './BadgePopup';
import { db } from '../services/db';

interface LayoutProps {
  children: ReactNode;
  user: UserProfile;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const systemMenuRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (systemMenuRef.current && !systemMenuRef.current.contains(event.target as Node)) {
        setIsSystemOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers ---

  const handleSwitchUser = () => {
      db.logout();
      onLogout();
      navigate('/login', { replace: true });
  };

  const handleSplashRedirect = () => {
      navigate('/');
  };

  const handleSignOut = () => {
      db.logout();
      onLogout();
      navigate('/', { replace: true });
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname.startsWith(to) && to !== '/' ? true : location.pathname === to;
    return (
      <NavLink
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
          isActive 
            ? 'bg-[#D74B4B] text-[#F9F7E8] shadow-md shadow-[#D74B4B]/30' 
            : 'text-[#56636A] hover:bg-[#EBE9DE] hover:text-[#2C2C2C]'
        }`}
      >
        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#F9F7E8]' : 'text-[#8E9AAF] group-hover:text-[#D74B4B]'}`} />
        <span className="font-semibold font-japanese tracking-wide">{label}</span>
        {isActive && (
            <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F7E8] flex font-sans text-[#2C2C2C]">
      <BadgePopup />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#2C2C2C]/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white/95 backdrop-blur-xl border-r border-[#E5E0D0] shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out transform flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header - Samurai Icon Button */}
        <div className="p-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group transition-transform active:scale-95 text-left"
            title="Return to Landing Page"
          >
             <div className="w-12 h-12 bg-[#2F3E46] rounded-xl flex items-center justify-center border-2 border-[#D74B4B] shadow-lg shadow-[#D74B4B]/20 group-hover:shadow-[#D74B4B]/40 transition-shadow">
                <Sword className="w-7 h-7 text-[#F9F7E8]" />
             </div>
             <div>
                <h1 className="text-lg font-black tracking-tighter uppercase text-[#2F3E46] leading-none group-hover:text-[#D74B4B] transition-colors">Sakura</h1>
                <h1 className="text-lg font-black tracking-tighter uppercase text-[#D74B4B] leading-none">Sensei</h1>
             </div>
          </button>
          <button onClick={toggleSidebar} className="lg:hidden text-[#8E9AAF] hover:text-[#2C2C2C]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex flex-col px-4 gap-1.5 flex-1 overflow-y-auto custom-scrollbar pb-6">
          <div className="px-4 py-2 text-[10px] font-black text-[#8E9AAF] uppercase tracking-widest opacity-60 mt-2">Dojo Entrance</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/progress" icon={TrendingUp} label="My Progress" />
          <NavItem to="/kana" icon={Type} label="Kana Charts" />
          
          <div className="px-4 py-2 mt-6 text-[10px] font-black text-[#8E9AAF] uppercase tracking-widest opacity-60">Study Materials</div>
          <NavItem to="/study" icon={BookOpen} label="Modules" />
          <NavItem to="/reading" icon={Book} label="Reading" />
          <NavItem to="/listening" icon={Headphones} label="Listening" />
          
          <div className="px-4 py-2 mt-6 text-[10px] font-black text-[#8E9AAF] uppercase tracking-widest opacity-60">Training Grounds</div>
          <NavItem to="/flashcards" icon={Layers} label="Flashcards" />
          <NavItem to="/practice" icon={Brain} label="Mock Exam" />
          <NavItem to="/coach" icon={MessageCircle} label="AI Sensei" />
          
          <div className="px-4 py-2 mt-6 text-[10px] font-black text-[#8E9AAF] uppercase tracking-widest opacity-60">Record</div>
          <NavItem to="/badges" icon={Award} label="Trophies" />
        </nav>
        
        {/* Minimal User Info at bottom */}
        <div className="p-4 border-t border-[#E5E0D0] bg-[#FDFCF8]">
            <div 
                onClick={() => {
                    navigate('/profile');
                    setIsSidebarOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F0EFE9] transition-colors cursor-pointer border border-transparent hover:border-[#E5E0D0]"
            >
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="User" className="w-9 h-9 rounded-full border border-[#D5D0C0] bg-white" />
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-[#2C2C2C] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#8E9AAF] font-bold uppercase tracking-wide">Level {user.level}</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col bg-[#F9F7E8]">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#F9F7E8]/80 backdrop-blur-md border-b border-[#E5E0D0] px-6 py-3 flex items-center justify-between">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-[#EBE9DE] lg:hidden text-[#56636A]"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
             {/* Streak Link */}
             <NavLink to="/streak" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8E1] text-amber-600 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors hover:scale-105 active:scale-95 group">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500 group-hover:animate-pulse" />
                <span className="font-bold text-sm">{user.streak} Days</span>
             </NavLink>

             {/* Trophies Link */}
             <NavLink to="/badges" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FCE4EC] text-[#D74B4B] rounded-full border border-pink-200 hover:bg-pink-100 transition-colors hover:scale-105 active:scale-95">
                <Award className="w-4 h-4" />
                <span className="font-bold text-sm">{user.badges.length} Trophies</span>
             </NavLink>

            {/* --- SYSTEM MENU DROPDOWN (Torii Gate) --- */}
            <div className="relative" ref={systemMenuRef}>
                <button 
                    onClick={() => setIsSystemOpen(!isSystemOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isSystemOpen ? 'bg-[#2F3E46] border-[#2F3E46] text-white shadow-md scale-105' : 'bg-white border-[#E5E0D0] text-[#2C2C2C] hover:border-[#D74B4B] hover:text-[#D74B4B]'}`}
                    title="System Menu"
                >
                    <span className="text-sm">⛩️</span>
                </button>

                {isSystemOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E5E0D0] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                        <div className="p-3 border-b border-[#E5E0D0] bg-[#F9F7E8]">
                            <p className="text-[10px] font-black text-[#8E9AAF] uppercase tracking-widest text-center">System</p>
                        </div>
                        <div className="p-1.5">
                            <button 
                                onClick={handleSplashRedirect}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-[#56636A] hover:bg-[#F0EFE9] hover:text-[#2C2C2C] rounded-xl transition-all text-xs font-bold text-left"
                            >
                                <MonitorPlay className="w-4 h-4" /> Title Screen
                            </button>
                            
                            <button 
                                onClick={handleSwitchUser}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-[#56636A] hover:bg-[#F0EFE9] hover:text-[#2C2C2C] rounded-xl transition-all text-xs font-bold text-left"
                            >
                                <Repeat className="w-4 h-4" /> Switch User
                            </button>
                            
                            <div className="my-1 border-t border-[#E5E0D0]"></div>

                            <button 
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-[#D74B4B] hover:bg-[#D74B4B]/10 rounded-xl transition-all text-xs font-bold text-left"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

             {/* Profile Link (Avatar) */}
             <NavLink 
                to="/profile" 
                className="relative group transition-transform hover:scale-105 active:scale-95"
                title="Go to Profile"
             >
                <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white ring-2 ring-[#E5E0D0] group-hover:ring-[#D74B4B] transition-all">
                    <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                    />
                </div>
             </NavLink>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full flex-1">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
