
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
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import KanjiPractice from './pages/KanjiPractice';
import ExamRules from './pages/ExamRules';
import { UserProfile } from './types';
import { db, onUserUpdate } from './services/db';

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
    // Check for an active session immediately
    const currentUser = db.getCurrentUser();
    if (currentUser) {
        console.log("SakuraSensei: Session restored for", currentUser.username);
        setUser(currentUser);
        // Verify streak on app load
        db.checkDailyStreak();
    }
    setLoading(false);

    // Subscribe to dynamic user updates (XP, Badge unlocks)
    const unsubscribe = onUserUpdate((updatedUser) => {
        setUser(updatedUser);
    });

    return () => {
        unsubscribe();
    };
  }, []);

  const handleAuthSuccess = (u: UserProfile) => {
    console.log("SakuraSensei: Auth success", u.username);
    setUser(u);
    // Also check streak on fresh login
    db.checkDailyStreak();
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
  };

  const handleOnboardingComplete = (updates: Partial<UserProfile>) => {
      db.updateUser(updates);
      const updatedUser = db.getCurrentUser();
      if (updatedUser) setUser({ ...updatedUser });
      db.checkDailyStreak();
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F9F7E8] text-[#D74B4B] font-bold">Loading SakuraSensei...</div>;

  return (
    <HashRouter>
      <Routes>
        {/* 1. Opening Page (Landing) - The Entry Point */}
        <Route path="/" element={<Landing user={user} />} />
        
        {/* 2. User Registration */}
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* 3. User Verification (Login) */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleAuthSuccess} />} 
        />
        
        {/* 4. Main App Routes */}
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
                            <Route path="kanji-practice" element={<KanjiPractice />} />
                            <Route path="flashcards" element={<Flashcards level={user.level} />} />
                            <Route path="practice" element={<MockExam />} />
                            <Route path="coach" element={<GeminiCoach level={user.level} />} />
                            <Route path="badges" element={<Badges />} />
                            <Route path="streak" element={<Streak user={user} />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="progress" element={<Progress />} />
                            <Route path="exam-rules" element={<ExamRules />} />
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
