import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { BADGES } from '../constants';
import { UserProfile } from '../types';
import { Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const Badges: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(db.getCurrentUser());
  }, []);

  if (!user) return null;

  const earnedIds = new Set(user.badges);
  const total = BADGES.length;
  const earnedCount = earnedIds.size;
  const percentage = Math.round((earnedCount / total) * 100);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#D74B4B] to-[#BC002D] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden border border-[#D74B4B]/30">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-2 font-japanese">
                      <Award className="w-8 h-8 text-yellow-300" /> Trophy Room
                  </h2>
                  <p className="opacity-90 text-white/90">Collect them all to become a true Sensei.</p>
              </div>
              <div className="text-right">
                  <div className="text-5xl font-black mb-1">{earnedCount} <span className="text-2xl font-medium opacity-70">/ {total}</span></div>
                  <div className="h-3 w-48 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-300 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                  </div>
              </div>
          </div>
          <div className="absolute -right-10 -top-10 opacity-10 rotate-12 text-white">
              <Award className="w-48 h-48" />
          </div>
      </div>

      {/* Badges Grid - Rectangular cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {BADGES.map((badge, idx) => {
              const isUnlocked = earnedIds.has(badge.id);
              const Icon = badge.icon;
              
              return (
                  <MotionDiv
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`relative rounded-2xl p-5 border-2 transition-all flex flex-col items-center text-center overflow-hidden group ${
                        isUnlocked 
                        ? 'bg-white border-[#D74B4B] shadow-md hover:shadow-lg hover:-translate-y-1' 
                        : 'bg-[#F0EFE9] border-[#E5E0D0] hover:border-[#E5E0D0]'
                    }`}
                  >
                      {/* Icon Container with Lock Overlay */}
                      <div className={`w-20 h-20 mb-4 p-4 rounded-full transition-transform duration-300 group-hover:scale-110 relative flex items-center justify-center ${isUnlocked ? 'bg-[#F9F7E8]' : 'bg-[#E5E0D0]'}`}>
                          <Icon className={`w-full h-full ${isUnlocked ? badge.color : 'text-gray-400 opacity-20'}`} />
                          
                          {/* Lock Overlay */}
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Lock className="w-8 h-8 text-[#8E9AAF] drop-shadow-md" />
                            </div>
                          )}
                      </div>

                      {/* Title */}
                      <h4 className={`font-bold text-lg leading-tight mb-2 font-japanese ${isUnlocked ? 'text-[#2C2C2C]' : 'text-[#8E9AAF]'}`}>
                          {badge.name}
                      </h4>
                      
                      {/* Separator */}
                      <div className={`w-12 h-1 rounded-full mb-3 ${isUnlocked ? 'bg-[#D74B4B]/30' : 'bg-[#D5D0C0]'}`}></div>

                      {/* Description - Always visible */}
                      <p className={`text-sm font-medium leading-snug px-2 ${isUnlocked ? 'text-[#56636A]' : 'text-[#8E9AAF]'}`}>
                          {badge.description}
                      </p>

                  </MotionDiv>
              );
          })}
      </div>
    </div>
  );
};

export default Badges;