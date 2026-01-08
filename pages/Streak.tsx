import React from 'react';
import { UserProfile } from '../types';
import { STREAK_LEVELS } from '../constants';
import { Flame, Lock, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface StreakProps {
    user: UserProfile;
}

const Streak: React.FC<StreakProps> = ({ user }) => {
    // Find current level
    const currentLevelIndex = STREAK_LEVELS.findIndex(l => user.streak < l.days);
    const activeLevel = currentLevelIndex === -1 
        ? STREAK_LEVELS[STREAK_LEVELS.length - 1] 
        : currentLevelIndex === 0 
            ? STREAK_LEVELS[0] // Before first level
            : STREAK_LEVELS[currentLevelIndex - 1];

    const nextLevel = currentLevelIndex === -1 ? null : STREAK_LEVELS[currentLevelIndex];

    return (
        <div className="relative min-h-[calc(100vh-140px)] rounded-3xl overflow-hidden bg-white border border-[#E5E0D0] shadow-sm">
            {/* --- ANIME BACKGROUND THEME (Ink Wash Style) --- */}
            {/* Soft Ink Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#EBE9DE] via-white to-white pointer-events-none" />
            
            {/* Rising Ink Drops */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                    <MotionDiv
                        key={i}
                        className="absolute bg-[#2C2C2C] rounded-full blur-sm"
                        style={{
                            width: Math.random() * 8 + 2 + 'px',
                            height: Math.random() * 8 + 2 + 'px',
                            left: Math.random() * 100 + '%',
                        }}
                        initial={{ y: '100vh', opacity: 0 }}
                        animate={{ 
                            y: '-10vh', 
                            opacity: [0, 0.5, 0],
                            scale: [1, 1.5, 0]
                        }}
                        transition={{ 
                            duration: Math.random() * 5 + 3, 
                            repeat: Infinity, 
                            delay: Math.random() * 5,
                            ease: 'linear'
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-6 lg:p-10 flex flex-col items-center">
                
                {/* Header Title */}
                <MotionDiv 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-[#2C2C2C] font-japanese tracking-tighter drop-shadow-sm">
                        WAY OF THE BRUSH
                    </h1>
                    <p className="text-[#D74B4B] font-bold tracking-widest uppercase mt-2 text-sm">Consistency is your Power</p>
                </MotionDiv>

                {/* Main Counter */}
                <MotionDiv 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-center bg-white rounded-full border-4 border-[#D74B4B] shadow-[0_0_40px_rgba(215,75,75,0.2)] mb-12 group"
                >
                    {/* Rotating Ring */}
                    <div className="absolute inset-0 border-4 border-dashed border-[#2C2C2C]/10 rounded-full animate-[spin_10s_linear_infinite]" />
                    
                    <Zap className="w-12 h-12 text-[#D74B4B] fill-[#D74B4B] mb-2 animate-pulse" />
                    <span className="text-7xl font-black text-[#2C2C2C] leading-none">{user.streak}</span>
                    <span className="text-xl font-bold text-[#8E9AAF] uppercase">Days</span>
                </MotionDiv>

                {/* Progress Timeline */}
                <div className="w-full max-w-4xl relative">
                    <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-[#E5E0D0] md:left-1/2 md:-ml-0.5" />
                    
                    {STREAK_LEVELS.map((level, idx) => {
                        const isReached = user.streak >= level.days;
                        const isNext = !isReached && (idx === 0 || user.streak >= STREAK_LEVELS[idx - 1].days);
                        
                        return (
                            <MotionDiv 
                                key={level.days}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative flex items-center gap-6 mb-8 md:mb-16 ${
                                    idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Spacer for Desktop Centering */}
                                <div className="hidden md:block w-1/2" />
                                
                                {/* Node Icon */}
                                <div className={`relative z-10 w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-4 shadow-sm transition-all ${
                                    isReached 
                                        ? 'bg-[#D74B4B] border-white text-white shadow-lg shadow-[#D74B4B]/30' 
                                        : isNext 
                                            ? 'bg-white border-[#D74B4B] text-[#D74B4B] animate-pulse'
                                            : 'bg-[#F0EFE9] border-[#E5E0D0] text-[#8E9AAF]'
                                }`}>
                                    {isReached ? <CheckCircle2 className="w-8 h-8" /> : isNext ? <Flame className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 p-5 rounded-xl border relative overflow-hidden group transition-all ${
                                    isReached
                                        ? 'bg-white border-[#D74B4B]/30 shadow-lg'
                                        : isNext
                                            ? 'bg-white/80 border-[#D74B4B]/20'
                                            : 'bg-[#F9F7E8] border-[#E5E0D0] opacity-60'
                                }`}>
                                    
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-xl font-black font-japanese italic ${isReached ? 'text-[#2C2C2C]' : 'text-[#8E9AAF]'}`}>
                                            {level.name}
                                        </h3>
                                        <div className="p-1 rounded-lg bg-white shadow-sm border border-gray-100">
                                             <level.icon className={`w-8 h-8 ${isReached ? level.color : 'text-gray-300'}`} />
                                        </div>
                                    </div>
                                    <p className="text-[#56636A] text-sm font-medium mb-2">{level.description}</p>
                                    <div className="inline-block px-2 py-1 bg-[#F0EFE9] rounded text-xs font-mono font-bold text-[#8E9AAF] border border-[#E5E0D0]">
                                        {level.days} Day Milestone
                                    </div>
                                </div>
                            </MotionDiv>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Streak;