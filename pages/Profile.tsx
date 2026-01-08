
import React, { useEffect, useState } from 'react';
import { UserProfile, TestResult } from '../types';
import { db } from '../services/db';
import { BADGES, AVATAR_OPTIONS } from '../constants';
import { 
    Trophy, 
    Calendar, 
    Zap, 
    TrendingUp, 
    Activity, 
    BookOpen,
    User,
    Edit2,
    X,
    Smartphone,
    Copy,
    Check,
    LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [transferCode, setTransferCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = db.getCurrentUser();
    if (u) {
        setUser(u);
        setHistory(db.getTestHistory().reverse().slice(0, 5)); // Last 5 results
    }
  }, []);

  const handleAvatarSelect = (newAvatar: string) => {
      if (user) {
          db.updateUser({ avatar: newAvatar });
          setUser({ ...user, avatar: newAvatar });
          setShowAvatarModal(false);
      }
  };

  const handleGenerateCode = () => {
      if (!user) return;
      try {
          const code = db.generateTransferCode(user.id);
          setTransferCode(code);
          setShowExport(true);
      } catch (e) {
          alert("Failed to generate code.");
      }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(transferCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
      db.logout();
      navigate('/');
      window.location.reload(); // Ensure state clears completely
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  const totalBadges = BADGES.length;
  const earnedBadges = BADGES.filter(b => user.badges.includes(b.id));
  
  // Calculate Avg Score
  const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
  const totalQuestions = history.reduce((acc, curr) => acc + curr.total, 0);
  const avgAccuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5E0D0] shadow-md relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D74B4B]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                    <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                        alt={user.name} 
                        className="w-32 h-32 rounded-full border-4 border-[#F9F7E8] shadow-xl bg-white group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="bg-black/50 p-2 rounded-full text-white">
                             <Edit2 className="w-6 h-6" />
                         </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#D74B4B] text-white p-2 rounded-full border-4 border-white pointer-events-none">
                        <User className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-black text-[#2C2C2C] font-japanese">{user.name}</h1>
                    <p className="text-[#8E9AAF] font-medium flex items-center justify-center md:justify-start gap-2">
                        <span className="bg-[#2F3E46] text-[#F9F7E8] px-2 py-0.5 rounded text-xs font-bold">{user.username}</span>
                        <span>•</span>
                        <span>Joined: {new Date().getFullYear()}</span>
                    </p>
                    
                    {/* Level Progress (Clickable) */}
                    <Link to="/progress" className="block max-w-md mt-4 mx-auto md:mx-0 group cursor-pointer">
                        <div className="flex justify-between text-sm font-bold mb-1">
                            <span className="text-[#D74B4B] group-hover:underline">Level {user.level}</span>
                            <span className="text-[#56636A]">{user.xp % 1000} / 1000 XP</span>
                        </div>
                        <div className="h-3 bg-[#EBE9DE] rounded-full overflow-hidden border border-[#E5E0D0] group-hover:border-[#D74B4B] transition-colors">
                            <div 
                                className="h-full bg-gradient-to-r from-[#D74B4B] to-[#BC002D] transition-all duration-1000" 
                                style={{ width: `${(user.xp % 1000) / 10}%` }}
                            />
                        </div>
                    </Link>
                </div>

                {/* Big Stat */}
                <div className="hidden md:flex flex-col items-end gap-2">
                     <div className="text-5xl font-black text-[#2C2C2C] font-japanese">{user.level}</div>
                     <div className="text-[#8E9AAF] text-sm font-bold uppercase tracking-wider">Current Focus</div>
                     <button 
                        onClick={handleGenerateCode}
                        className="mt-2 text-xs font-bold text-[#56636A] hover:text-[#D74B4B] flex items-center gap-1 transition-colors"
                     >
                        <Smartphone className="w-3 h-3" /> Sync Device
                     </button>
                </div>
            </div>
            
            {/* Mobile Actions */}
            <div className="md:hidden mt-6 flex justify-center gap-4">
                 <button 
                    onClick={handleGenerateCode}
                    className="text-sm font-bold bg-[#EBE9DE] text-[#56636A] px-4 py-2 rounded-lg"
                 >
                    Sync Device
                 </button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/streak" className="bg-white p-6 rounded-2xl border border-[#E5E0D0] shadow-sm hover:shadow-lg hover:border-[#D74B4B]/30 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <p className="text-[#8E9AAF] text-xs font-bold uppercase">Current Streak</p>
                        <p className="text-2xl font-black text-[#2C2C2C]">{user.streak} Days</p>
                    </div>
                </div>
            </Link>

            <Link to="/progress" className="bg-white p-6 rounded-2xl border border-[#E5E0D0] shadow-sm hover:shadow-lg hover:border-[#D74B4B]/30 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[#8E9AAF] text-xs font-bold uppercase">Total XP</p>
                        <p className="text-2xl font-black text-[#2C2C2C]">{user.xp}</p>
                    </div>
                </div>
            </Link>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D0] shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[#8E9AAF] text-xs font-bold uppercase">Avg. Accuracy</p>
                        <p className="text-2xl font-black text-[#2C2C2C]">{avgAccuracy}%</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border border-[#E5E0D0] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold font-japanese text-[#2C2C2C] flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#D74B4B]" /> Recent Activity
                    </h3>
                </div>

                <div className="space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-[#8E9AAF] italic bg-[#F9F7E8] rounded-xl border border-[#E5E0D0] border-dashed">
                            No exam history yet. Go practice!
                        </div>
                    ) : (
                        history.map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F9F7E8] border border-[#E5E0D0]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-[#E5E0D0]">
                                        <BookOpen className="w-4 h-4 text-[#56636A]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2C2C2C] text-sm">Mock Exam {h.level}</p>
                                        <p className="text-xs text-[#8E9AAF]">{new Date(h.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`font-bold ${h.score === h.total ? 'text-[#D74B4B]' : 'text-[#2C2C2C]'}`}>
                                        {Math.round((h.score / h.total) * 100)}%
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-white rounded-3xl border border-[#E5E0D0] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold font-japanese text-[#2C2C2C] flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> Latest Badges
                    </h3>
                    <Link to="/badges" className="text-sm font-bold text-[#D74B4B] hover:underline">View All</Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {earnedBadges.slice(0, 6).map(badge => (
                        <div key={badge.id} className="flex flex-col items-center text-center p-3 bg-[#F9F7E8] rounded-xl border border-[#E5E0D0] group">
                            <div className="mb-2 p-2 bg-white rounded-full shadow-sm border border-[#E5E0D0]">
                                <badge.icon className={`w-6 h-6 ${badge.color}`} />
                            </div>
                            <p className="text-xs font-bold text-[#2C2C2C] line-clamp-1">{badge.name}</p>
                        </div>
                    ))}
                    {earnedBadges.length === 0 && (
                        <div className="col-span-3 text-center py-8 text-[#8E9AAF] italic">
                            No badges yet. Keep studying!
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sign Out Button */}
        <div className="flex justify-center mt-8">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#E5E0D0] text-[#56636A] font-bold rounded-2xl hover:border-[#D74B4B] hover:text-[#D74B4B] hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
            >
                <LogOut className="w-5 h-5" /> Sign Out
            </button>
        </div>

        {/* Avatar Selection Modal */}
        {showAvatarModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowAvatarModal(false)}
                />
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#2C2C2C] font-japanese">Choose Your Avatar</h2>
                        <button 
                            onClick={() => setShowAvatarModal(false)}
                            className="p-2 hover:bg-[#F9F7E8] rounded-full text-[#56636A]"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {AVATAR_OPTIONS.map((avatarUrl, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAvatarSelect(avatarUrl)}
                                className={`rounded-xl p-2 border-2 transition-all hover:scale-105 group ${
                                    user.avatar === avatarUrl 
                                    ? 'border-[#D74B4B] bg-[#D74B4B]/10 ring-2 ring-[#D74B4B]/20' 
                                    : 'border-transparent hover:border-[#E5E0D0] hover:bg-[#F9F7E8]'
                                }`}
                            >
                                <img 
                                    src={avatarUrl} 
                                    alt={`Avatar Option ${idx + 1}`}
                                    className="w-full h-auto rounded-full bg-white shadow-sm" 
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Export Code Modal */}
        {showExport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowExport(false)}
                />
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full animate-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#2C2C2C] font-japanese">Sensei Scroll</h2>
                        <button onClick={() => setShowExport(false)}><X className="w-6 h-6 text-[#8E9AAF]" /></button>
                    </div>
                    <p className="text-[#56636A] mb-4 text-sm">
                        Copy this code to transfer your progress to another device. Paste it in the login screen on your new device.
                    </p>
                    
                    <div className="bg-[#2F3E46] p-4 rounded-xl mb-4 relative group">
                        <p className="font-mono text-xs text-[#F9F7E8] break-all max-h-40 overflow-y-auto custom-scrollbar">
                            {transferCode}
                        </p>
                    </div>

                    <button 
                        onClick={handleCopy}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            copied ? 'bg-green-50 text-white' : 'bg-[#D74B4B] text-white hover:bg-[#BC002D]'
                        }`}
                    >
                        {copied ? <><Check className="w-5 h-5" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Code</>}
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;
