import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
      await db.register(name, username, password);
      setLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
          navigate('/login'); 
      }, 2000);

    } catch (err: any) {
      const msg = err.message || "Failed to register";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7E8] p-4 relative overflow-hidden">
      
       {/* Background decoration */}
      <div className="absolute inset-0 bg-[#F9F7E8]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D74B4B]/5 rounded-full blur-3xl" />

      {/* Success Overlay */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#F9F7E8]/95 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="text-center transform animate-bounce">
                <CheckCircle2 className="w-32 h-32 text-[#2F3E46] mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#2C2C2C] font-japanese">Profile Created!</h2>
                <p className="text-[#56636A] font-medium mt-2">Proceeding to Verification...</p>
            </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10 border border-[#E5E0D0]">
        <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-[#2F3E46]/10 mb-4 border border-[#2F3E46]/20">
                <span className="text-4xl">📜</span>
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] font-japanese">New Registration</h1>
            <p className="text-[#8E9AAF]">Create your Ninja identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}
            
            <div>
                <label className="block text-sm font-bold text-[#56636A] mb-1">Display Name</label>
                <input 
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Sensei will call you this"
                    disabled={isSuccess || loading}
                    className="w-full px-4 py-3 rounded-xl border border-[#D5D0C0] bg-[#F9F7E8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D74B4B] font-medium text-[#2C2C2C] placeholder:text-[#8E9AAF] transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-[#56636A] mb-1">User ID</label>
                <input 
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Unique ID (e.g. ninja_01)"
                    disabled={isSuccess || loading}
                    className="w-full px-4 py-3 rounded-xl border border-[#D5D0C0] bg-[#F9F7E8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D74B4B] font-mono text-sm text-[#2C2C2C] placeholder:text-[#8E9AAF] transition-all"
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
                className="w-full bg-[#D74B4B] hover:bg-[#BC002D] text-[#F9F7E8] font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#D74B4B]/30 mt-4"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
            </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#56636A]">
            Already verified? <Link to="/login" className="text-[#D74B4B] font-bold hover:underline hover:text-[#BC002D] transition-colors">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;