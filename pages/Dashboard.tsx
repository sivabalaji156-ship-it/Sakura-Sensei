
import React, { useEffect } from 'react';
import { UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { 
  Play, 
  MapPin, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Award,
  Zap,
  Info,
  Scroll
} from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  useEffect(() => {
    // Check for "Glorious Purpose" badge (First Login)
    if (!user.badges.includes('glorious_purpose')) {
        const updatedBadges = [...user.badges, 'glorious_purpose'];
        db.updateUser({ badges: updatedBadges });
    }
  }, [user.badges]);

  const handleLevelClick = (lvl: string) => {
    navigate(`/study`); 
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-[#E5E0D0] relative overflow-hidden group">
        
        {/* Abstract Red Sun Background */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#D74B4B] rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-2xl">
                <h2 className="text-4xl font-extrabold mb-4 font-japanese text-[#2F3E46]">Ganbatte, {user.name}! 🎌</h2>
                <p className="opacity-90 text-lg mb-8 leading-relaxed text-[#56636A]">
                    Your journey to mastery continues. You are currently focusing on <span className="font-bold bg-[#D74B4B]/10 px-2 rounded border border-[#D74B4B]/20 text-[#D74B4B]">{user.level}</span>. 
                    Ready to conquer new Kanji?
                </p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/flashcards')}
                        className="bg-[#D74B4B] text-[#F9F7E8] px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#D74B4B]/30 hover:bg-[#BC002D] transition-all flex items-center gap-2"
                    >
                        <Play className="w-5 h-5 fill-[#F9F7E8]" /> Continue Learning
                    </button>
                </div>
            </div>

            {/* Streak Counter Widget */}
            <div 
                onClick={() => navigate('/streak')}
                className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px] cursor-pointer hover:bg-orange-100 transition-colors group/streak"
            >
                <div className="p-3 bg-white rounded-full mb-2 shadow-sm group-hover/streak:scale-110 transition-transform">
                     <Zap className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                </div>
                <span className="text-3xl font-black text-[#2C2C2C] leading-none mb-1">{user.streak}</span>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Day Streak</span>
            </div>
        </div>
      </div>

      {/* --- EXAM GUIDE & ACTIONS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exam Rules Card (Special Feature) */}
          <div 
            onClick={() => navigate('/exam-rules')}
            className="lg:col-span-3 bg-[#2F3E46] p-6 rounded-2xl shadow-md cursor-pointer group relative overflow-hidden flex items-center justify-between"
          >
              <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-[#D74B4B] rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Scroll className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white mb-1">Examination Guide & Rules</h3>
                      <p className="text-gray-300 text-sm">View pass marks, scoring criteria, and time limits for N5 - N1.</p>
                  </div>
              </div>
              <div className="relative z-10 bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                  <ArrowRight className="w-5 h-5 text-white" />
              </div>
              
              {/* Background Pattern */}
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
              <Info className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 pointer-events-none" />
          </div>

          {/* Quick Actions */}
           <div onClick={() => navigate('/kana')} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D0] hover:border-[#D74B4B]/50 hover:shadow-lg transition-all cursor-pointer group">
               <div className="w-12 h-12 bg-[#2F3E46]/10 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform text-[#2F3E46]">あ</div>
               <h4 className="font-bold text-[#2C2C2C] text-lg">Kana</h4>
               <p className="text-[#8E9AAF] text-sm">Master the basics.</p>
           </div>
           
           <div onClick={() => navigate('/reading')} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D0] hover:border-[#D74B4B]/50 hover:shadow-lg transition-all cursor-pointer group">
               <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform text-sky-600">📖</div>
               <h4 className="font-bold text-[#2C2C2C] text-lg">Stories</h4>
               <p className="text-[#8E9AAF] text-sm">Read stories for your level.</p>
           </div>

           <div onClick={() => navigate('/badges')} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D0] hover:border-[#D74B4B]/50 hover:shadow-lg transition-all cursor-pointer group">
               <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform text-yellow-600">
                    <Award />
               </div>
               <h4 className="font-bold text-[#2C2C2C] text-lg">Trophies</h4>
               <p className="text-[#8E9AAF] text-sm">View your achievements.</p>
           </div>
      </div>

      {/* Level Roadmap */}
      <div>
          <h3 className="text-2xl font-bold text-[#2C2C2C] mb-6 flex items-center gap-2 font-japanese">
              <MapPin className="w-6 h-6 text-[#D74B4B]" /> JLPT Roadmap
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {levels.map((lvl, index) => {
                  const isCurrent = lvl === user.level;
                  const isPassed = levels.indexOf(user.level) > index; 
                  
                  return (
                      <MotionDiv 
                        key={lvl}
                        whileHover={{ y: -5 }}
                        onClick={() => handleLevelClick(lvl)}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all overflow-hidden group ${
                            isCurrent 
                            ? 'bg-white border-[#D74B4B] shadow-lg shadow-[#D74B4B]/10 ring-2 ring-[#D74B4B]/20' 
                            : isPassed 
                                ? 'bg-[#F0EFE9] border-green-700/30 opacity-80'
                                : 'bg-[#EBE9DE] border-[#D5D0C0] opacity-60'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-4">
                              <span className={`text-3xl font-black ${isCurrent ? 'text-[#D74B4B]' : 'text-[#8E9AAF]'}`}>
                                  {lvl}
                              </span>
                              {isPassed ? <CheckCircle2 className="text-green-600" /> : !isCurrent && <Lock className="text-[#8E9AAF]" />}
                          </div>
                          
                          <p className="text-sm text-[#56636A] font-medium mb-4">
                              {lvl === 'N5' ? 'Beginner' : lvl === 'N1' ? 'Master' : 'Intermediate'}
                          </p>
                          
                          <div className="flex items-center text-xs font-bold text-[#D74B4B] group-hover:translate-x-1 transition-transform">
                              Enter <ArrowRight className="w-3 h-3 ml-1" />
                          </div>
                      </MotionDiv>
                  )
              })}
          </div>
      </div>

    </div>
  );
};

export default Dashboard;
