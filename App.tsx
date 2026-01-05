import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import StudyModules from './pages/StudyModules';
import ModuleDetail from './pages/ModuleDetail';
import Listening from './pages/Listening';
import Reading from './pages/Reading';
import Kana from './pages/Kana';
import Badges from './pages/Badges';
import Flashcards from './pages/Flashcards';
import MockExam from './pages/MockExam';
import GeminiCoach from './pages/GeminiCoach';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Streak from './pages/Streak';
import { UserProfile } from './types';
import { db } from './services/db';

const ProtectedRoute = ({ children, user }: { children?: React.ReactNode, user: UserProfile | null }) => {
    const location = useLocation();
    if (!user) {
        // Redirect to Landing Page (/) instead of Login, 
        // to satisfy "App should open with the opening/landing page"
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleAuthSuccess = (u: UserProfile) => {
    setUser(u);
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
  };

  const handleOnboardingComplete = (updates: Partial<UserProfile>) => {
      db.updateUser(updates);
      const updatedUser = db.getCurrentUser();
      if (updatedUser) setUser({ ...updatedUser });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-cyan-400 font-bold">Loading SakuraSensei...</div>;

  return (
    <HashRouter>
      <Routes>
        {/* 1. Opening Page (Landing) - The Entry Point */}
        <Route path="/" element={<Landing user={user} />} />
        
        {/* 2. User Registration - Targeted by 'Start' button on Landing */}
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* 3. User Verification (Login) - Targeted after Registration completes or Start on Landing */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleAuthSuccess} />} 
        />
        
        {/* 4. Main App Routes (Dashboard, Trophies, Study) */}
        <Route path="/*" element={
            <ProtectedRoute user={user}>
                {!user?.isOnboarded ? (
                    <Onboarding onComplete={handleOnboardingComplete} initialName={user?.name} />
                ) : (
                    user && (
                    <Layout user={user} onLogout={handleLogout}>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard user={user} />} />
                            <Route path="study" element={<StudyModules level={user.level} />} />
                            <Route path="study/:type" element={<ModuleDetail level={user.level} />} />
                            <Route path="listening" element={<Listening level={user.level} />} />
                            <Route path="reading" element={<Reading />} />
                            <Route path="kana" element={<Kana />} />
                            <Route path="flashcards" element={<Flashcards level={user.level} />} />
                            <Route path="practice" element={<MockExam />} />
                            <Route path="coach" element={<GeminiCoach level={user.level} />} />
                            <Route path="badges" element={<Badges />} />
                            <Route path="streak" element={<Streak user={user} />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </Layout>
                    )
                )}
            </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;