
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';

// Safe casts for motion components in browser environment
const MotionSvg = motion.svg as any;
const MotionPath = motion.path as any;
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionP = motion.p as any;

// --- SVGs for Traditional Art Elements ---

const Cloud = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
    <MotionSvg
        viewBox="0 0 200 100"
        className={`absolute opacity-80 ${className}`}
        initial={{ x: -20 }}
        animate={{ x: 20 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 8, delay, ease: "easeInOut" }}
    >
        <path
            d="M20,60 Q40,30 70,50 Q90,20 130,40 Q160,30 180,60 L180,80 L20,80 Z"
            fill="#FFFFFF"
            stroke="none"
        />
    </MotionSvg>
);

const EnsoBrush = () => (
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <MotionPath
            d="M 100 100 m -75 0 a 75 75 0 1 0 150 0 a 75 75 0 1 0 -150 0"
            fill="none"
            stroke="#D74B4B" 
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ filter: 'url(#watercolor)' }}
        />
        <defs>
            <filter id="watercolor">
                <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
            </filter>
        </defs>
    </svg>
);

interface LandingProps {
    user: UserProfile | null;
}

const Landing: React.FC<LandingProps> = ({ user }) => {
    const navigate = useNavigate();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleStart = () => {
        setIsNavigating(true);
        setTimeout(() => {
            if (user) {
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        }, 1200);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#F9F7E8] text-[#2C2C2C] font-japanese selection:bg-[#D74B4B] selection:text-white">
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-40 pointer-events-none z-40" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")` }} 
            />

            {/* Scenery */}
            <div className="absolute inset-0 z-0 flex flex-col justify-end items-center">
                <MotionDiv 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-[10%] w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#BC002D] mix-blend-multiply opacity-90 shadow-[0_0_40px_rgba(188,0,45,0.3)]"
                />

                <div className="w-full relative h-[40vh] md:h-[50vh]">
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end opacity-30 text-[#8E9AAF]">
                         <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                            <path fill="currentColor" d="M0,224L120,192C240,160,480,96,720,106.7C960,117,1200,203,1320,245.3L1440,288L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
                         </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end text-[#2F3E46]">
                         <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                            <path fill="currentColor" d="M0,320L240,320L480,320L720,64L960,320L1200,320L1440,320Z"></path>
                            <path fill="#F9F7E8" d="M660,120 L720,64 L780,120 L750,140 L720,110 L690,140 Z" opacity="0.9"></path>
                         </svg>
                    </div>
                </div>
            </div>

            <Cloud className="top-[15%] left-[10%] w-64 text-white" delay={0} />
            <Cloud className="top-[25%] right-[15%] w-48 text-white" delay={2} />

            {/* Main Content */}
            <div className="relative z-50 h-full flex flex-col items-center justify-center p-6 text-center">
                
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mb-12 space-y-4"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-[#D74B4B] font-bold tracking-[0.5em] text-sm md:text-base uppercase mb-2">Japanese Language Proficiency</span>
                        <h1 className="text-6xl md:text-8xl font-black text-[#2F3E46] tracking-tight drop-shadow-sm" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>
                            桜 先生
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-[#56636A] mt-2 font-serif italic">
                            Sakura Sensei
                        </h2>
                    </div>
                    
                    <p className="text-[#56636A] max-w-md mx-auto leading-relaxed font-medium">
                        Begin your journey through the language of the rising sun. <br/>
                        Consistency is the path to mastery.
                    </p>
                </MotionDiv>

                {/* --- Styled Button Box --- */}
                <div className="relative group">
                    <MotionButton
                        onClick={handleStart}
                        disabled={isNavigating}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-10 px-16 py-5 bg-[#D74B4B] text-[#F9F7E8] font-black text-xl tracking-[0.2em] rounded-lg shadow-[0_10px_20px_rgba(215,75,75,0.3)] border-2 border-[#BC002D] hover:bg-[#BC002D] transition-all flex items-center gap-2 overflow-hidden"
                    >
                        {/* Subtle Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                        
                        <span>START・IKUZO</span>
                    </MotionButton>

                    {/* Enso Animation Layer */}
                    <AnimatePresence>
                        {isNavigating && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none">
                                <EnsoBrush />
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Loading Text */}
                <AnimatePresence>
                    {isNavigating && (
                        <MotionP
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-12 text-[#D74B4B] font-bold text-sm tracking-widest uppercase"
                        >
                            Entering Dojo...
                        </MotionP>
                    )}
                </AnimatePresence>

            </div>

            {/* Falling Petals */}
            {Array.from({ length: 8 }).map((_, i) => (
                <MotionDiv
                    key={i}
                    className="absolute z-10 text-[#FFC0CB] opacity-60 text-xl pointer-events-none"
                    initial={{ y: -20, x: Math.random() * window.innerWidth }}
                    animate={{ y: window.innerHeight + 50, rotate: 360, x: `+=${Math.random() * 100 - 50}` }}
                    transition={{ 
                        duration: 10 + Math.random() * 10, 
                        repeat: Infinity, 
                        delay: Math.random() * 5,
                        ease: "linear"
                    }}
                >
                    🌸
                </MotionDiv>
            ))}
        </div>
    );
};

export default Landing;