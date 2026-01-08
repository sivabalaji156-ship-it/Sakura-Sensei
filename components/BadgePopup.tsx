import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onBadgeUnlock } from '../services/db';
import { Badge } from '../types';
import { Sparkles, Star } from 'lucide-react';

const MotionDiv = motion.div as any;

export const BadgePopup: React.FC = () => {
    const [queue, setQueue] = useState<Badge[]>([]);
    const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);

    useEffect(() => {
        const unsubscribe = onBadgeUnlock((badge) => {
            setQueue(prev => [...prev, badge]);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!currentBadge && queue.length > 0) {
            const next = queue[0];
            setCurrentBadge(next);
            setQueue(prev => prev.slice(1));
            
            // Auto dismiss after 4 seconds
            setTimeout(() => {
                setCurrentBadge(null);
            }, 4000);
        }
    }, [queue, currentBadge]);

    return (
        <AnimatePresence>
            {currentBadge && (
                <div className="fixed inset-0 pointer-events-none z-[100] flex items-end justify-center pb-12">
                    <MotionDiv
                        initial={{ y: 200, opacity: 0, scale: 0.5, rotate: 10 }}
                        animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ y: 200, opacity: 0, scale: 0.5, rotate: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative bg-slate-900 p-1 rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full mx-4 border-4 border-yellow-400"
                    >
                        {/* Anime Speed Lines Background */}
                        <div className="absolute inset-0 z-0 bg-indigo-950">
                             <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,_transparent_0deg_10deg,_rgba(250,204,21,0.1)_10deg_20deg)] animate-[spin_10s_linear_infinite]" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center p-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl">
                            <MotionDiv
                                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-3 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                            >
                                <currentBadge.icon className={`w-24 h-24 ${currentBadge.color}`} />
                            </MotionDiv>
                            
                            <MotionDiv
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-xs font-black text-yellow-400 tracking-[0.2em] uppercase mb-1">Achievement Unlocked</h3>
                                <h2 className="text-2xl font-black text-white font-japanese leading-tight mb-2">
                                    {currentBadge.name}
                                </h2>
                                <p className="text-slate-400 text-sm font-medium px-4">
                                    {currentBadge.description}
                                </p>
                            </MotionDiv>
                        </div>

                        {/* Sparkles Decoration */}
                        <MotionDiv 
                            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: 45 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute top-4 right-6 text-yellow-400"
                        >
                            <Sparkles className="w-8 h-8 fill-yellow-400" />
                        </MotionDiv>
                        <MotionDiv 
                            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: -45 }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                            className="absolute bottom-6 left-6 text-cyan-400"
                        >
                            <Star className="w-6 h-6 fill-cyan-400" />
                        </MotionDiv>

                        {/* Top Banner */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-6 bg-yellow-400 blur-xl opacity-50"></div>

                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>
    );
};