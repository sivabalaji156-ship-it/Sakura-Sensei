
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, DownloadCloud, X } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safely get debug users
    try {
        setAvailableUsers(db.getDebugUsers());
    } catch (e) {
        console.warn("Failed to load debug users", e);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAutoFill = (u: any) => {
    setUsername(u.username);
    setPassword(u.password || '');
    setShowSuggestions(false);
  };

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

  const handleImport = async () => {
      if (!importCode) return;
      setLoading(true);
      try {
          const user = db.restoreFromTransferCode(importCode);
          setLoading(false);
          setShowImport(false);
          setIsSuccess(true);
          setTimeout(() => {
              onLogin(user); 
          }, 1200);
      } catch (e: any) {
          setLoading(false);
          setError(e.message || "Invalid Code");
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

      {/* Import Modal */}
      {showImport && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-[#2C2C2C]">Restore Progress</h2>
                      <button onClick={() => setShowImport(false)}><X className="w-6 h-6 text-[#8E9AAF]" /></button>
                  </div>
                  <textarea 
                      value={importCode}
                      onChange={e => setImportCode(e.target.value)}
                      placeholder="Paste your Sensei Scroll (Transfer Code) here..."
                      className="w-full h-32 p-4 rounded-xl border border-[#D5D0C0] bg-[#F9F7E8] mb-4 text-xs font-mono resize-none focus:ring-2 focus:ring-[#D74B4B] focus:outline-none"
                  />
                  {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}
                  <button 
                      onClick={handleImport}
                      disabled={loading || !importCode}
                      className="w-full bg-[#2F3E46] text-white py-4 rounded-xl font-bold hover:bg-[#1A262C] transition-all disabled:opacity-50"
                  >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Restore Data"}
                  </button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10 border border-[#E5E0D0] max-h-[90vh] overflow-visible">
        <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-[#D74B4B]/10 mb-4 border border-[#D74B4B]/20">
                <span className="text-4xl">⛩️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] font-japanese">User Verification</h1>
            <p className="text-[#8E9AAF]">Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {error && !showImport && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}
            
            <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-bold text-[#56636A] mb-1">User ID</label>
                <input 
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="e.g., sakura_fan"
                    disabled={isSuccess || loading}
                    className="w-full px-4 py-3 rounded-xl border border-[#D5D0C0] bg-[#F9F7E8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D74B4B] font-medium text-[#2C2C2C] placeholder:text-[#8E9AAF] transition-all"
                    autoComplete="off"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && availableUsers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#E5E0D0] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
                        <div className="px-4 py-2 bg-[#F9F7E8] border-b border-[#E5E0D0] text-xs font-bold text-[#8E9AAF] uppercase tracking-wider flex items-center justify-between">
                            <span>Suggested Profiles</span>
                            <span className="text-[10px] bg-[#D74B4B]/10 text-[#D74B4B] px-1.5 rounded">Fast Login</span>
                        </div>
                        {availableUsers.map((u, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleAutoFill(u)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-[#F9F7E8] border-b border-[#F0EFE9] last:border-0 transition-colors text-left group"
                            >
                                <img 
                                    src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} 
                                    className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#E5E0D0]" 
                                    alt={u.name} 
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[#2C2C2C] text-sm group-hover:text-[#D74B4B] truncate">{u.name}</div>
                                    <div className="text-xs text-[#56636A] truncate">@{u.username}</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[#E5E0D0] group-hover:text-[#D74B4B]" />
                            </button>
                        ))}
                    </div>
                )}
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

        <div className="mt-6 flex flex-col gap-2 items-center text-sm">
            <p className="text-[#56636A]">
                New challenger? <Link to="/register" className="text-[#D74B4B] font-bold hover:underline hover:text-[#BC002D] transition-colors">Register Profile</Link>
            </p>
            
            <button 
                onClick={() => setShowImport(true)}
                className="text-[#8E9AAF] font-bold flex items-center gap-1 hover:text-[#2F3E46] transition-colors text-xs"
            >
                <DownloadCloud className="w-3 h-3" /> Restore from other device
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
