
import React, { useEffect, useState } from 'react';
import { db, onUserUpdate } from '../services/db';
import { UserProfile, JLPTLevel } from '../types';
import { BADGES } from '../constants';
import { 
    Zap, 
    TrendingUp, 
    Book, 
    PenTool, 
    MessageSquare, 
    Target, 
    Sword, 
    Crown, 
    Star,
    Award,
    ChevronRight,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MotionDiv = motion.div as any;

const Progress: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState({ kanji: 0, vocabulary: 0, grammar: 0 });
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    const loadData = () => {
        const u = db.getCurrentUser();
        if (u) {
            setUser(u);
            setProgress(db.getProgress(u.level));
            setTestHistory(db.getTestHistory());
        }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = onUserUpdate((updatedUser) => {
        setUser(updatedUser);
        // Refresh derived data
        setProgress(db.getProgress(updatedUser.level));
        setTestHistory(db.getTestHistory());
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <div className="p-10 text-center text-[#D74B4B]">Summoning Data...</div>;

  const levelNames: Record<string, string> = { 
    N5: 'Genin (Novice)', 
    N4: 'Chunin (Intermediate)', 
    N3: 'Jonin (Advanced)', 
    N2: 'Hashira (Master)', 
    N1: 'Kage (Legend)' 
  };

  const XP_THRESHOLDS: Record<string, number> = {
      'N5': 1000,
      'N4': 2500,
      'N3': 5000,
      'N2': 9000,
      'N1': 15000
  };

  const currentThreshold = XP_THRESHOLDS[user.level] || 15000;
  const rankProgress = Math.min(100, (user.xp / currentThreshold) * 100);

  const chartData = [
    { name: 'Kanji', value: progress.kanji, color: '#EF4444' }, // Red
    { name: 'Vocab', value: progress.vocabulary, color: '#F59E0B' }, // Amber
    { name: 'Grammar', value: progress.grammar, color: '#3B82F6' }, // Blue
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500 relative">
        
        {/* --- HERO SECTION: CHARACTER CARD --- */}
        <div className="bg-[#2C2C2C] text-[#F9F7E8] rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden border-2 border-[#D74B4B]">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] animate-[spin_60s_linear_infinite]" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                {/* Avatar with Aura */}
                <div className="relative">
                    <div className="w-40 h-40 rounded-full border-4 border-[#F9F7E8] overflow-hidden bg-white shadow-[0_0_30px_rgba(215,75,75,0.6)] relative z-10">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -inset-4 border-2 border-dashed border-[#D74B4B] rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
                </div>

                {/* Stats Block */}
                <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                        <h1 className="text-4xl lg:text-5xl font-black font-japanese tracking-wider uppercase drop-shadow-md">
                            {user.name}
                        </h1>
                        <span className="px-3 py-1 bg-[#D74B4B] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm border border-white/20">
                            {levelNames[user.level] || 'Student'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#8E9AAF] font-bold text-sm mb-6 justify-center md:justify-start">
                        <Sword className="w-4 h-4" /> Class: {user.level} Candidate
                        <span className="mx-2">•</span>
                        <Crown className="w-4 h-4 text-yellow-500" /> XP: {user.xp}
                    </div>

                    {/* EXP Bar */}
                    <div className="bg-black/30 rounded-full h-8 w-full relative overflow-hidden border border-white/10 shadow-inner group cursor-help" title={`Requires ${currentThreshold} XP for promotion`}>
                        <MotionDiv 
                            initial={{ width: 0 }}
                            animate={{ width: `${rankProgress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D74B4B] via-red-500 to-yellow-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold text-white shadow-sm z-10">
                            <span>{Math.floor(rankProgress)}% to Promotion</span>
                            <span>Target: {currentThreshold} XP</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowRoadmap(true)}
                        className="mt-4 text-xs font-bold text-[#D74B4B] hover:text-white hover:bg-[#D74B4B] px-3 py-1 rounded-full transition-all border border-[#D74B4B] inline-flex items-center gap-1"
                    >
                        View Promotion Path <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E0D0] relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-6 h-6 text-[#D74B4B]" />
                    <h2 className="text-xl font-bold text-[#2C2C2C] font-japanese">Skill Mastery</h2>
                </div>
                
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12, fontWeight: 'bold'}} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E0D0] relative">
                <div className="flex items-center gap-2 mb-6">
                    <Book className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-[#2C2C2C] font-japanese">Daily Quests</h2>
                </div>
                
                <div className="space-y-4">
                    <QuestItem 
                        title="Kanji Review" 
                        progress={Math.min(100, (chartData[0].value / 20) * 100)} 
                        xp={50} 
                        icon={<PenTool className="w-4 h-4" />}
                        color="text-red-500"
                    />
                    <QuestItem 
                        title="Read a Story" 
                        progress={testHistory.length > 0 ? 100 : 0} 
                        xp={100} 
                        icon={<Book className="w-4 h-4" />}
                        color="text-blue-500"
                    />
                    <QuestItem 
                        title="Mock Exam" 
                        progress={testHistory.filter(t => t.score > t.total * 0.8).length > 0 ? 100 : 30} 
                        xp={500} 
                        icon={<Award className="w-4 h-4" />}
                        color="text-yellow-500"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E0D0] flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-bold text-[#2C2C2C] font-japanese">Battle Log</h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[200px] space-y-3 pr-2">
                    {testHistory.length === 0 ? (
                        <p className="text-sm text-[#8E9AAF] italic text-center py-4">No battles recorded yet.</p>
                    ) : (
                        testHistory.slice().reverse().map((t, i) => (
                            <div key={i} className="flex justify-between items-center text-sm p-3 bg-[#F9F7E8] rounded-xl border border-[#E5E0D0]">
                                <div>
                                    <span className="font-bold text-[#2C2C2C] block">Mock Exam {t.level}</span>
                                    <span className="text-[10px] text-[#8E9AAF]">{new Date(t.date).toLocaleDateString()}</span>
                                </div>
                                <div className={`font-black ${t.score === t.total ? 'text-[#D74B4B]' : 'text-[#56636A]'}`}>
                                    {Math.round((t.score / t.total) * 100)}%
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* --- ROADMAP MODAL --- */}
        <AnimatePresence>
            {showRoadmap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <MotionDiv 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setShowRoadmap(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <MotionDiv 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-[#E5E0D0] max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-3xl font-black text-[#2C2C2C] mb-6 font-japanese text-center">Upcoming Promotions</h2>
                        
                        <div className="space-y-6">
                            {Object.entries(levelNames).map(([lvl, title], idx) => {
                                const threshold = XP_THRESHOLDS[lvl];
                                const isPassed = user.xp >= threshold;
                                const isCurrent = lvl === user.level;
                                const isLocked = user.xp < threshold && !isCurrent;

                                return (
                                    <div key={lvl} className={`p-4 rounded-xl border-2 flex items-center gap-4 ${isCurrent ? 'border-[#D74B4B] bg-[#FFF8E1]' : isPassed ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isCurrent ? 'bg-[#D74B4B]' : isPassed ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {isLocked ? <Lock className="w-5 h-5" /> : lvl}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#2C2C2C]">{title}</h3>
                                            <p className="text-xs text-[#56636A]">Requirement: {threshold} XP</p>
                                        </div>
                                        {isPassed && <Award className="w-6 h-6 text-green-500" />}
                                        {isCurrent && <span className="text-xs font-bold text-[#D74B4B] uppercase tracking-wider">Current</span>}
                                    </div>
                                )
                            })}
                        </div>

                        <button 
                            onClick={() => setShowRoadmap(false)}
                            className="w-full mt-8 bg-[#2F3E46] text-white py-4 rounded-xl font-bold hover:bg-[#1A262C] transition-all"
                        >
                            Close Map
                        </button>
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>

    </div>
  );
};

const QuestItem: React.FC<{ title: string; progress: number; xp: number; icon: any; color: string }> = ({ title, progress, xp, icon, color }) => (
    <div className="flex items-center gap-4">
        <div className={`p-2 bg-gray-50 rounded-lg border border-gray-100 ${color}`}>{icon}</div>
        <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#2C2C2C]">{title}</span>
                <span className="text-[#D74B4B]">{progress}%</span>
            </div>
            <div className="h-2 bg-[#EBE9DE] rounded-full overflow-hidden">
                <MotionDiv 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#D74B4B]"
                />
            </div>
        </div>
        <div className="text-xs font-black text-[#56636A] min-w-[50px] text-right">
            +{progress === 100 ? xp : 0} XP
        </div>
    </div>
);

export default Progress;
