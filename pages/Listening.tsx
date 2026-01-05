import React, { useState } from 'react';
import { JLPTLevel } from '../types';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';

interface ListeningProps {
  level: JLPTLevel;
}

const Listening: React.FC<ListeningProps> = ({ level }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Simulation of audio player
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 font-japanese">JLPT {level} Listening Practice</h2>

        <div className="bg-white rounded-3xl shadow-xl border border-[#E5E0D0] overflow-hidden">
            <div className="bg-[#2F3E46] p-10 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[#D74B4B] opacity-10 blur-3xl rounded-full scale-150"></div>
                <div className={`w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-6 relative z-10 backdrop-blur-md border border-white/10 ${isPlaying ? 'animate-pulse' : ''}`}>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg text-[#2F3E46]">
                         {isPlaying ? <Pause className="w-8 h-8 fill-[#2F3E46]" /> : <Play className="w-8 h-8 fill-[#2F3E46] ml-1" />}
                    </div>
                </div>
                <h3 className="relative z-10 text-xl font-bold font-japanese">Problem 1: Daily Conversation</h3>
                <p className="relative z-10 text-[#8E9AAF]">Track 04 • {level}</p>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-center gap-6 mb-8">
                    <button className="p-3 rounded-full hover:bg-[#F0EFE9] text-[#56636A]"><Rewind className="w-6 h-6" /></button>
                    <button onClick={togglePlay} className="p-4 rounded-full bg-[#D74B4B] hover:bg-[#BC002D] text-white shadow-lg shadow-[#D74B4B]/30 transition-all scale-110">
                        {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                    </button>
                    <button className="p-3 rounded-full hover:bg-[#F0EFE9] text-[#56636A]"><FastForward className="w-6 h-6" /></button>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                    {[0.75, 1, 1.25, 1.5].map(s => (
                        <button 
                            key={s} 
                            onClick={() => setSpeed(s)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold border ${speed === s ? 'bg-[#EBE9DE] border-[#D74B4B] text-[#D74B4B]' : 'bg-white border-[#E5E0D0] text-[#56636A]'}`}
                        >
                            {s}x
                        </button>
                    ))}
                </div>

                <div className="bg-[#F9F7E8] p-6 rounded-2xl border border-[#E5E0D0]">
                    <h4 className="font-bold text-[#2C2C2C] mb-4">Question</h4>
                    <p className="mb-4 text-[#56636A]">What is the woman going to buy at the store?</p>
                    
                    <div className="space-y-3">
                        {['Bread and Milk', 'Eggs and Milk', 'Bread and Coffee', 'Coffee and Eggs'].map((opt, i) => (
                            <button key={i} className="w-full text-left p-4 rounded-xl border border-[#E5E0D0] bg-white hover:border-[#D74B4B] hover:bg-white transition-all text-[#2C2C2C]">
                                <span className="font-bold text-[#8E9AAF] mr-4">{i+1}.</span> {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Listening;