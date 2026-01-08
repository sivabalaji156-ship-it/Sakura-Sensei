import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
  initialName?: string;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialName }) => {
  const [step, setStep] = useState(initialName ? 2 : 1);
  const [name, setName] = useState(initialName || '');
  const [goal, setGoal] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    const examDateStr = date.toISOString().split('T')[0];

    // Default to N5, user can change/explore freely
    onComplete({
      name: name || 'Student',
      level: 'N5',
      dailyGoalMinutes: goal,
      isOnboarded: true,
      examDate: examDateStr,
      streak: 1, 
      xp: 50,
      badges: []
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7E8] flex items-center justify-center p-4 relative overflow-hidden font-japanese">
      {/* Background Textures */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#D74B4B]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#2F3E46]/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C2C2C' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg relative z-10 border border-[#E5E0D0]">
        
        <div className="relative z-10">
            <div className="flex justify-center mb-8">
                <div className="bg-[#D74B4B]/10 p-4 rounded-full border border-[#D74B4B]/20">
                    <span className="text-4xl animate-bounce">🎌</span>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-[#2C2C2C] mb-2 font-japanese">
                {step === 1 && "Welcome, Student!"}
                {step === 2 && "Daily Commitment"}
            </h1>
            <p className="text-center text-[#56636A] mb-8">
                {step === 1 && "Let's begin your path to fluency."}
                {step === 2 && "Consistency is key. How much time can you spare?"}
            </p>

            {/* Step 1: Name */}
            {step === 1 && (
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-[#56636A]">What should we call you?</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5D0C0] focus:outline-none focus:ring-2 focus:ring-[#D74B4B] transition-all bg-[#F9F7E8] focus:bg-white text-[#2C2C2C]"
                        onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(2)}
                    />
                    <button 
                        onClick={() => setStep(2)}
                        disabled={!name.trim()}
                        className="w-full bg-[#D74B4B] hover:bg-[#BC002D] text-[#F9F7E8] font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#D74B4B]/30"
                    >
                        Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Step 2: Goal */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="space-y-3">
                        {[15, 30, 60].map((t) => (
                            <button
                                key={t}
                                onClick={() => setGoal(t)}
                                className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${
                                    goal === t
                                    ? 'border-[#D74B4B] bg-[#D74B4B]/5 text-[#D74B4B]'
                                    : 'border-transparent bg-[#F9F7E8] text-[#56636A] hover:bg-[#F0EFE9] border-[#E5E0D0]'
                                }`}
                            >
                                <span className="font-bold">{t} Minutes / Day</span>
                                {goal === t && <Check className="w-5 h-5 text-[#D74B4B]" />}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleFinish}
                        disabled={loading}
                        className="w-full mt-6 bg-[#2F3E46] hover:bg-[#1A262C] text-[#F9F7E8] font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#2F3E46]/30 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enter Dojo 🚀"}
                    </button>
                </div>
            )}

            {/* Steps indicator */}
            <div className="flex justify-center gap-2 mt-8">
                {[1, 2].map(i => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-[#D74B4B]' : 'w-2 bg-[#E5E0D0]'}`} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;