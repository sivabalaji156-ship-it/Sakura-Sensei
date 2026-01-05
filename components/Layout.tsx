import React, { ReactNode, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Book
} from 'lucide-react';
import { UserProfile } from '../types';
import { BadgePopup } from './BadgePopup';

interface LayoutProps {
  children: ReactNode;
  user: UserProfile;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname.startsWith(to) && to !== '/' ? true : location.pathname === to;
    return (
      <NavLink
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-[#D74B4B] text-[#F9F7E8] shadow-lg shadow-[#D74B4B]/30' 
            : 'text-[#56636A] hover:bg-[#EBE9DE] hover:text-[#2C2C2C]'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-[#F9F7E8]' : 'text-[#8E9AAF] group-hover:text-[#D74B4B]'}`} />
        <span className="font-semibold font-japanese">{label}</span>
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
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-[#E5E0D0] shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out transform flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-[#E5E0D0]">
          <div className="flex items-center gap-2 text-[#D74B4B]">
            <span className="text-3xl">⛩️</span>
            <h1 className="text-xl font-black tracking-tighter uppercase text-[#2F3E46]">Sakura<span className="text-[#D74B4B]">Sensei</span></h1>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-[#8E9AAF] hover:text-[#2C2C2C]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col px-4 gap-1.5 mt-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-2 text-xs font-bold text-[#8E9AAF] uppercase tracking-wider">Start</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
          <NavItem to="/kana" icon={Type} label="Kana" />
          
          <div className="px-4 py-2 mt-4 text-xs font-bold text-[#8E9AAF] uppercase tracking-wider">Learn</div>
          <NavItem to="/study" icon={BookOpen} label="Study" />
          <NavItem to="/reading" icon={Book} label="Stories" />
          <NavItem to="/listening" icon={Headphones} label="Listening" />
          
          <div className="px-4 py-2 mt-4 text-xs font-bold text-[#8E9AAF] uppercase tracking-wider">Train</div>
          <NavItem to="/flashcards" icon={Layers} label="Flashcards" />
          <NavItem to="/practice" icon={Brain} label="Mock Exam" />
          <NavItem to="/coach" icon={MessageCircle} label="AI Sensei" />
          
          <div className="px-4 py-2 mt-4 text-xs font-bold text-[#8E9AAF] uppercase tracking-wider">Profile</div>
          <NavItem to="/badges" icon={Award} label="Badges" />
        </nav>

        <div className="p-6 bg-[#FDFCF8] border-t border-[#E5E0D0]">
            <div className="bg-[#EBE9DE] rounded-2xl p-4 border border-[#D5D0C0] mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[#2C2C2C] truncate">{user.name}</p>
                        <p className="text-xs text-[#D74B4B] font-bold bg-[#D74B4B]/10 px-2 py-0.5 rounded-full inline-block border border-[#D74B4B]/20">{user.level}</p>
                    </div>
                </div>
                <div className="w-full bg-white rounded-full h-2 mt-2 border border-[#D5D0C0]">
                    <div 
                        className="bg-[#D74B4B] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(user.xp % 1000) / 10}%` }}
                    ></div>
                </div>
                <p className="text-xs text-[#56636A] mt-1 text-right">{user.xp} XP</p>
            </div>
            
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-[#56636A] hover:text-[#D74B4B] transition-colors text-sm font-semibold w-full px-2"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
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

          <div className="flex items-center gap-4 ml-auto">
             {/* Streak Link */}
             <NavLink to="/streak" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8E1] text-amber-600 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors hover:scale-105 active:scale-95 group">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500 group-hover:animate-pulse" />
                <span className="font-bold text-sm">{user.streak} Days</span>
             </NavLink>

             <NavLink to="/badges" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCE4EC] text-[#D74B4B] rounded-full border border-pink-200 hover:bg-pink-100 transition-colors hover:scale-105 active:scale-95">
                <Award className="w-4 h-4" />
                <span className="font-bold text-sm">{user.badges.length} Trophies</span>
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