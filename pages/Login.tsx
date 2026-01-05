import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await db.login(username, password);
      setLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
          onLogin(user); 
      }, 1200);

    } catch (err: any) {
      const msg = err.message || "Failed to login";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7E8] p-4 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[#F9F7E8]" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D74B4B]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#2F3E46]/5 rounded-full blur-3xl" />

      {/* Success Overlay */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#F9F7E8]/95 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="text-center transform animate-bounce">
                <CheckCircle2 className="w-32 h-32 text-[#2F3E46] mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#2C2C2C] font-japanese">Welcome Back!</h2>
                <p className="text-[#56636A] font-medium">Entering Dojo...</p>
            </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10 border border-[#E5E0D0]">
        <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-[#D74B4B]/10 mb-4 border border-[#D74B4B]/20">
                <span className="text-4xl">⛩️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] font-japanese">User Verification</h1>
            <p className="text-[#8E9AAF]">Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}
            
            <div>
                <label className="block text-sm font-bold text-[#56636A] mb-1">User ID</label>
                <input 
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g., sakura_fan"
                    disabled={isSuccess || loading}
                    className="w-full px-4 py-3 rounded-xl border border-[#D5D0C0] bg-[#F9F7E8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D74B4B] font-medium text-[#2C2C2C] placeholder:text-[#8E9AAF] transition-all"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-[#56636A] mb-1">Password</label>
                <input 
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isSuccess || loading}
                    className="w-full px-4 py-3 rounded-xl border border-[#D5D0C0] bg-[#F9F7E8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D74B4B] text-[#2C2C2C] placeholder:text-[#8E9AAF] transition-all"
                />
            </div>

            <button 
                type="submit"
                disabled={loading || isSuccess}
                className="w-full bg-[#2F3E46] hover:bg-[#1A262C] text-[#F9F7E8] font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#2F3E46]/30 mt-4"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log In <ArrowRight className="w-5 h-5" /></>}
            </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#56636A]">
            New challenger? <Link to="/register" className="text-[#D74B4B] font-bold hover:underline hover:text-[#BC002D] transition-colors">Register Profile</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;