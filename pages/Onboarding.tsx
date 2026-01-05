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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg relative overflow-hidden border border-white/50">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>

        <div className="relative z-10">
            <div className="flex justify-center mb-8">
                <div className="bg-sky-100 p-4 rounded-full shadow-inner">
                    <span className="text-4xl animate-bounce">🎌</span>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
                {step === 1 && "Welcome, Student!"}
                {step === 2 && "Daily Commitment"}
            </h1>
            <p className="text-center text-slate-500 mb-8">
                {step === 1 && "Let's begin your path to fluency."}
                {step === 2 && "Consistency is key. How much time can you spare?"}
            </p>

            {/* Step 1: Name */}
            {step === 1 && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">What should we call you?</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-slate-50 focus:bg-white"
                        onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(2)}
                    />
                    <button 
                        onClick={() => setStep(2)}
                        disabled={!name.trim()}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-sky-200"
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
                                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                                    : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <span className="font-bold">{t} Minutes / Day</span>
                                {goal === t && <Check className="w-5 h-5 text-sky-500" />}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleFinish}
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-sky-200 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enter Dojo 🚀"}
                    </button>
                </div>
            )}

            {/* Steps indicator */}
            <div className="flex justify-center gap-2 mt-8">
                {[1, 2].map(i => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-sky-500' : 'w-2 bg-slate-200'}`} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
