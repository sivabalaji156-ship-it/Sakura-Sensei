
import React, { useState, useEffect } from 'react';
import { HIRAGANA_CHART, KATAKANA_CHART } from '../data/jlptData';
import { Volume2, Type, Brain, BookOpen, Clock, AlertCircle, Check, X, Timer, Trophy } from 'lucide-react';
import { db } from '../services/db';

type Mode = 'study' | 'quiz';
type QuizState = 'setup' | 'playing' | 'result';

const Kana: React.FC = () => {
  const [tab, setTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [mode, setMode] = useState<Mode>('study');
  
  // Quiz State
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<{ char: string; romaji: string; options: string[] }[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentChart = tab === 'hiragana' ? HIRAGANA_CHART : KATAKANA_CHART;

  const playSound = (char: string) => {
      if (!char) return;
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
  };

  // --- Quiz Logic ---

  useEffect(() => {
    let timer: any;
    if (quizState === 'playing' && timeLeft > 0) {
        timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    finishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const startQuiz = () => {
      // Filter out empty spaces and create quiz items
      const validItems = currentChart.filter(c => c.char !== '' && c.romaji !== '');
      
      // Shuffle and take 15 items
      const quizItems = [...validItems].sort(() => 0.5 - Math.random()).slice(0, 15);
      
      const preparedQuestions = quizItems.map(item => {
          // Generate 3 distractors
          const distractors = validItems
              .filter(i => i.romaji !== item.romaji)
              .sort(() => 0.5 - Math.random())
              .slice(0, 3)
              .map(i => i.romaji);
          
          const options = [...distractors, item.romaji].sort(() => 0.5 - Math.random());
          return { ...item, options };
      });

      setQuestions(preparedQuestions);
      setCurrentQ(0);
      setScore(0);
      setTimeLeft(60); // 60 seconds for 15 questions
      setQuizState('playing');
      setQuizStartTime(Date.now());
      setSelectedAnswer(null);
      setIsCorrect(null);
  };

  const handleAnswer = (answer: string) => {
      if (selectedAnswer) return; // Prevent double clicks
      setSelectedAnswer(answer);
      
      const correct = answer === questions[currentQ].romaji;
      setIsCorrect(correct);
      
      if (correct) {
          setScore(s => s + 1);
          playSound(questions[currentQ].char);
      }

      setTimeout(() => {
          if (currentQ < questions.length - 1) {
              setCurrentQ(prev => prev + 1);
              setSelectedAnswer(null);
              setIsCorrect(null);
          } else {
              finishQuiz(correct ? score + 1 : score);
          }
      }, 800);
  };

  const finishQuiz = (finalScore?: number) => {
      setQuizState('result');
      const s = finalScore !== undefined ? finalScore : score;
      
      // --- Badge Logic ---
      const user = db.getCurrentUser();
      if (user) {
          const newBadges: string[] = [];
          const timeTaken = (Date.now() - quizStartTime) / 1000;
          const isPerfect = s === questions.length;

          // 1. Perfect Score Badges
          if (isPerfect) {
              if (tab === 'hiragana' && !user.badges.includes('kana_hashira')) {
                  newBadges.push('kana_hashira');
              }
              if (tab === 'katakana' && !user.badges.includes('katakana_titan')) {
                  newBadges.push('katakana_titan');
              }
              
              // 2. Speed Badge (Thunder Breathing)
              if (timeTaken <= 30 && !user.badges.includes('thunder_breathing')) {
                  newBadges.push('thunder_breathing');
              }
          } else {
              // 3. Disrespect Badge (Mongrel) - Awarded for making a mistake (imperfect score)
              if (!user.badges.includes('mongrel')) {
                  newBadges.push('mongrel');
              }
          }

          if (newBadges.length > 0) {
              db.updateUser({ badges: [...user.badges, ...newBadges], xp: user.xp + (s * 5) });
          } else {
              // Just add XP
              db.updateUser({ xp: user.xp + (s * 2) });
          }
      }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[80vh]">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#2C2C2C] flex items-center gap-2 font-japanese">
                <Type className="w-8 h-8 text-[#D74B4B]" /> 
                {tab === 'hiragana' ? 'Hiragana' : 'Katakana'} 
                <span className="text-[#8E9AAF] mx-2">/</span> 
                {mode === 'study' ? 'Chart' : 'Dojo'}
            </h2>
            <p className="text-[#56636A]">
                {mode === 'study' ? 'Click a card to hear the pronunciation.' : 'Test your reflexes in the quiz.'}
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Mode Toggle */}
            <div className="bg-white p-1 rounded-xl flex gap-1 border border-[#E5E0D0] shadow-sm h-fit">
                <button 
                    onClick={() => { setMode('study'); setQuizState('setup'); }}
                    className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${mode === 'study' ? 'bg-[#D74B4B] text-white shadow' : 'text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                >
                    <BookOpen className="w-4 h-4" /> Study
                </button>
                <button 
                    onClick={() => { setMode('quiz'); setQuizState('setup'); }}
                    className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${mode === 'quiz' ? 'bg-[#D74B4B] text-white shadow' : 'text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                >
                    <Brain className="w-4 h-4" /> Quiz
                </button>
            </div>

            {/* Script Switcher */}
            {mode === 'study' && (
                <div className="bg-white p-1 rounded-xl flex gap-1 border border-[#E5E0D0] shadow-sm h-fit">
                    <button 
                        onClick={() => setTab('hiragana')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'hiragana' ? 'bg-[#2F3E46] text-[#F9F7E8] shadow' : 'text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                    >
                        あ
                    </button>
                    <button 
                        onClick={() => setTab('katakana')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'katakana' ? 'bg-[#2F3E46] text-[#F9F7E8] shadow' : 'text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                    >
                        ア
                    </button>
                </div>
            )}
          </div>
      </div>

      {/* --- STUDY MODE --- */}
      {mode === 'study' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#E5E0D0] animate-in fade-in duration-300">
            <div className="grid grid-cols-5 gap-3 md:gap-4 lg:gap-6">
                {currentChart.map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => playSound(item.char)}
                        disabled={!item.char}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                            !item.char 
                            ? 'opacity-0 pointer-events-none' 
                            : 'bg-[#F9F7E8] hover:bg-[#2F3E46] border-2 border-[#E5E0D0] hover:border-[#2F3E46] group hover:shadow-lg hover:-translate-y-1'
                        }`}
                    >
                        <span className="absolute -bottom-2 -right-2 text-4xl font-black text-[#2C2C2C] opacity-5 group-hover:opacity-10 group-hover:text-white pointer-events-none">
                            {item.romaji}
                        </span>
                        <span className="text-4xl md:text-5xl lg:text-6xl font-japanese font-bold text-[#2C2C2C] group-hover:text-white mb-1 relative z-10">
                            {item.char}
                        </span>
                        <span className="text-sm md:text-base font-bold text-[#8E9AAF] group-hover:text-[#8E9AAF] relative z-10">
                            {item.romaji}
                        </span>
                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Volume2 className="w-4 h-4 text-white" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* --- QUIZ MODE --- */}
      {mode === 'quiz' && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
              
              {/* 1. Setup Screen */}
              {quizState === 'setup' && (
                  <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-[#E5E0D0]">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#D74B4B] to-[#BC002D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
                          <Brain className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-3xl font-black text-[#2C2C2C] font-japanese mb-2">
                          {tab === 'hiragana' ? 'Hiragana' : 'Katakana'} Challenge
                      </h2>
                      <p className="text-[#56636A] mb-8 max-w-md mx-auto">
                          Identify 15 characters in 60 seconds. <br/>
                          Prove your speed to earn the <span className="font-bold text-[#D74B4B]">Thunder Breathing</span> trophy!
                      </p>
                      
                      {/* Script Selector for Quiz */}
                      <div className="flex justify-center gap-4 mb-8">
                           <button 
                                onClick={() => setTab('hiragana')}
                                className={`px-6 py-4 rounded-xl border-2 font-bold text-lg transition-all ${tab === 'hiragana' ? 'border-[#D74B4B] bg-[#D74B4B]/5 text-[#D74B4B]' : 'border-[#E5E0D0] text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                           >
                               あ Hiragana
                           </button>
                           <button 
                                onClick={() => setTab('katakana')}
                                className={`px-6 py-4 rounded-xl border-2 font-bold text-lg transition-all ${tab === 'katakana' ? 'border-[#D74B4B] bg-[#D74B4B]/5 text-[#D74B4B]' : 'border-[#E5E0D0] text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                           >
                               ア Katakana
                           </button>
                      </div>

                      <button 
                        onClick={startQuiz}
                        className="w-full bg-[#2F3E46] text-[#F9F7E8] py-4 rounded-xl font-bold text-xl hover:bg-[#1A262C] transition-all shadow-lg shadow-[#2F3E46]/30 flex items-center justify-center gap-2"
                      >
                          Start Quiz <Brain className="w-6 h-6" />
                      </button>
                  </div>
              )}

              {/* 2. Playing Screen */}
              {quizState === 'playing' && questions[currentQ] && (
                  <div className="relative">
                      {/* Timer Bar */}
                      <div className="bg-white rounded-full p-2 mb-6 flex items-center justify-between border border-[#E5E0D0] shadow-sm">
                          <div className="flex items-center gap-2 px-2">
                               <Timer className={`w-5 h-5 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#D74B4B]'}`} />
                               <span className={`font-mono font-bold text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-[#2C2C2C]'}`}>{timeLeft}s</span>
                          </div>
                          <div className="flex-1 mx-4 bg-[#F0EFE9] h-2 rounded-full overflow-hidden">
                               <div 
                                    className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 20 ? 'bg-red-500' : 'bg-[#D74B4B]'}`}
                                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                               />
                          </div>
                          <div className="px-2 font-bold text-[#8E9AAF] text-sm">
                              {currentQ + 1}/{questions.length}
                          </div>
                      </div>

                      {/* Question Card */}
                      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#E5E0D0] text-center mb-6">
                           <div className="text-[120px] font-black font-japanese text-[#2C2C2C] leading-none mb-8">
                               {questions[currentQ].char}
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                               {questions[currentQ].options.map((opt, idx) => {
                                   let btnClass = "bg-[#F9F7E8] border-2 border-[#E5E0D0] hover:border-[#8E9AAF] text-[#56636A]";
                                   
                                   if (selectedAnswer) {
                                       if (opt === questions[currentQ].romaji) {
                                           btnClass = "bg-green-100 border-green-500 text-green-700 shadow-md"; // Correct
                                       } else if (opt === selectedAnswer) {
                                           btnClass = "bg-red-100 border-red-500 text-red-700 opacity-60"; // Incorrect selection
                                       } else {
                                           btnClass = "opacity-40 border-[#E5E0D0]";
                                       }
                                   }

                                   return (
                                       <button 
                                            key={idx}
                                            onClick={() => handleAnswer(opt)}
                                            disabled={selectedAnswer !== null}
                                            className={`p-4 rounded-xl font-bold text-xl transition-all ${btnClass}`}
                                       >
                                           {opt}
                                       </button>
                                   )
                               })}
                           </div>
                      </div>
                  </div>
              )}

              {/* 3. Result Screen */}
              {quizState === 'result' && (
                  <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-[#E5E0D0] animate-in zoom-in duration-300">
                      <div className="mb-6">
                          {score === questions.length ? (
                              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600 animate-bounce">
                                  <Trophy className="w-12 h-12" />
                              </div>
                          ) : score > questions.length / 2 ? (
                              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                                  <Check className="w-12 h-12" />
                              </div>
                          ) : (
                              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                                  <X className="w-12 h-12" />
                              </div>
                          )}
                      </div>

                      <h2 className="text-4xl font-black text-[#2C2C2C] font-japanese mb-2">
                          {score === questions.length ? "PERFECT!" : "Complete!"}
                      </h2>
                      <p className="text-[#8E9AAF] mb-8 text-lg">
                          You scored <span className="font-bold text-[#D74B4B]">{score}</span> out of {questions.length}
                      </p>

                      <div className="flex gap-4">
                          <button 
                            onClick={() => setQuizState('setup')} 
                            className="flex-1 bg-[#EBE9DE] hover:bg-[#D5D0C0] text-[#56636A] py-4 rounded-xl font-bold transition-all"
                          >
                              Menu
                          </button>
                          <button 
                            onClick={startQuiz} 
                            className="flex-1 bg-[#2F3E46] hover:bg-[#1A262C] text-white py-4 rounded-xl font-bold transition-all shadow-lg"
                          >
                              Retry
                          </button>
                      </div>

                      {/* Achievement Hint */}
                      {score === questions.length && (
                          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm flex items-center gap-2 justify-center">
                              <Trophy className="w-4 h-4" /> Badge progress updated! Check your profile.
                          </div>
                      )}
                  </div>
              )}
          </div>
      )}

    </div>
  );
};

export default Kana;
