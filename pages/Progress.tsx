
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
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
    Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

const MotionDiv = motion.div as any;

const Progress: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState({ kanji: 0, vocabulary: 0, grammar: 0 });
  const [testHistory, setTestHistory] = useState<any[]>([]);

  useEffect(() => {
    const u = db.getCurrentUser();
    if (u) {
        setUser(u);
        setProgress(db.getProgress(u.level));
        setTestHistory(db.getTestHistory());
    }
  }, []);

  if (!user) return <div className="p-10 text-center text-[#D74B4B]">Summoning Data...</div>;

  // --- RPG Logic ---
  const levelNames: Record<string, string> = { 
    N5: 'Genin (Novice)', 
    N4: 'Chunin (Intermediate)', 
    N3: 'Jonin (Advanced)', 
    N2: 'Hashira (Master)', 
    N1: 'Kage (Legend)' 
  };

  const calculateRank = (xp: number) => {
      // Simplified XP thresholds for visual rank progress within current JLPT level
      const threshold = 1000; 
      const currentRankProgress = (xp % threshold) / threshold * 100;
      return currentRankProgress;
  };

  const chartData = [
    { name: 'Kanji', value: progress.kanji, color: '#EF4444' }, // Red
    { name: 'Vocab', value: progress.vocabulary, color: '#F59E0B' }, // Amber
    { name: 'Grammar', value: progress.grammar, color: '#3B82F6' }, // Blue
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
        
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
                    {/* Spinning Aura */}
                    <div className="absolute -inset-4 border-2 border-dashed border-[#D74B4B] rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
                    <div className="absolute -inset-8 border border-dashed border-[#D74B4B] rounded-full animate-[spin_15s_linear_reverse_infinite] opacity-30" />
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
                        <Crown className="w-4 h-4 text-yellow-500" /> Title: {user.badges.length > 5 ? 'Veteran' : 'Rookie'}
                    </div>

                    {/* EXP Bar */}
                    <div className="bg-black/30 rounded-full h-8 w-full relative overflow-hidden border border-white/10 shadow-inner">
                        <MotionDiv 
                            initial={{ width: 0 }}
                            animate={{ width: `${calculateRank(user.xp)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D74B4B] via-red-500 to-yellow-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold text-white shadow-sm z-10">
                            <span>EXP: {user.xp}</span>
                            <span>NEXT RANK: {1000 - (user.xp % 1000)} XP</span>
                        </div>
                    </div>
                </div>

                {/* Big Rank Badge */}
                <div className="hidden lg:flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 border border-white/10 w-32">
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                    <span className="text-3xl font-black">{Math.floor(user.xp / 1000) + 1}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Power Lvl</span>
                </div>
            </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Mastery Radar (Bar Chart Representation) */}
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
                <p className="text-xs text-center text-[#8E9AAF] mt-2">Proficiency based on SRS reviews</p>
            </div>

            {/* 2. Quest Log (Tasks) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E0D0] relative">
                <div className="flex items-center gap-2 mb-6">
                    <Book className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-[#2C2C2C] font-japanese">Daily Quests</h2>
                </div>
                
                <div className="space-y-4">
                    <QuestItem 
                        title="Kanji Review" 
                        progress={Math.min(100, (chartData[0].value / 20) * 100)} // Mock calculation
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

            {/* 3. Recent History (Battle Log) */}
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

        {/* --- TROPHY SHOWCASE PREVIEW --- */}
        <div className="bg-[#2F3E46] rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
                <Award className="w-64 h-64 text-white -mr-10 -mt-10" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white font-japanese mb-2">Trophy Collection</h2>
                    <p className="text-gray-400 text-sm">You have collected {user.badges.length} out of {BADGES.length} trophies.</p>
                </div>
                
                {/* Mini Trophy Display */}
                <div className="flex -space-x-3">
                    {user.badges.slice(0, 5).map((bid, i) => {
                        const badge = BADGES.find(b => b.id === bid);
                        if(!badge) return null;
                        return (
                            <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-[#2F3E46] flex items-center justify-center z-10" title={badge.name}>
                                <badge.icon className={`w-5 h-5 ${badge.color}`} />
                            </div>
                        );
                    })}
                    {user.badges.length > 5 && (
                        <div className="w-10 h-10 rounded-full bg-[#D74B4B] border-2 border-[#2F3E46] flex items-center justify-center text-white text-xs font-bold z-20">
                            +{user.badges.length - 5}
                        </div>
                    )}
                </div>
            </div>
        </div>

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
