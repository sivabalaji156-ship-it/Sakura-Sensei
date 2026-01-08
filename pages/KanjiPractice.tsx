
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { UserProfile, StudyItem, JLPTLevel } from '../types';
import { 
    Book, 
    RotateCw, 
    PenTool, 
    Brain, 
    ArrowLeft,
    CheckCircle,
    GraduationCap,
    Languages,
    FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ModuleDetail from './ModuleDetail';

const KanjiPractice: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'review' | 'quiz'>('review');
  const [dueItems, setDueItems] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = db.getCurrentUser();
    setUser(u);
    if (u) {
        refreshDue(u.level);
    }
  }, []);

  const refreshDue = (level: JLPTLevel) => {
    const items = db.getDueItems(level, 'kanji');
    setDueItems(items);
    setLoading(false);
  };

  if (loading || !user) return <div className="p-10 text-center">Loading Dojo...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <Link to="/study" className="text-sm font-bold text-[#8E9AAF] hover:text-[#D74B4B] mb-1 inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Modules
                </Link>
                <h1 className="text-3xl font-black text-[#2C2C2C] font-japanese flex items-center gap-3">
                    <span className="bg-[#D74B4B] text-[#F9F7E8] p-2 rounded-lg text-2xl">漢</span> 
                    Kanji Dojo
                </h1>
                <p className="text-[#56636A]">Master characters via SRS review and translation quizzes.</p>
            </div>

            <div className="bg-white p-1 rounded-xl border border-[#E5E0D0] flex shadow-sm">
                <button 
                    onClick={() => setActiveTab('review')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'review' ? 'bg-[#2F3E46] text-[#F9F7E8] shadow' : 'text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                >
                    <PenTool className="w-4 h-4" /> SRS Review {dueItems.length > 0 && <span className="bg-[#D74B4B] text-white text-[10px] px-1.5 rounded-full">{dueItems.length}</span>}
                </button>
                <button 
                    onClick={() => setActiveTab('quiz')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'quiz' ? 'bg-[#2F3E46] text-[#F9F7E8] shadow' : 'text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                >
                    <Brain className="w-4 h-4" /> Quiz Mode
                </button>
                <button 
                    onClick={() => setActiveTab('library')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'library' ? 'bg-[#2F3E46] text-[#F9F7E8] shadow' : 'text-[#8E9AAF] hover:bg-[#F9F7E8]'}`}
                >
                    <Book className="w-4 h-4" /> Library
                </button>
            </div>
       </div>

       {/* Content Area */}
       <div className="min-h-[60vh]">
            {activeTab === 'library' && (
                <div className="animate-in fade-in duration-300">
                     <ModuleDetail level={user.level} type="kanji" />
                </div>
            )}
            
            {activeTab === 'review' && (
                <KanjiSRSReview items={dueItems} onComplete={() => refreshDue(user.level)} />
            )}

            {activeTab === 'quiz' && (
                <KanjiQuiz level={user.level} />
            )}
       </div>
    </div>
  );
};

// --- Sub-Component: Kanji SRS Review (Refactored: Removed Drawing, Simplified) ---
const KanjiSRSReview: React.FC<{ items: StudyItem[], onComplete: () => void }> = ({ items, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = items[currentIndex];

    const handleNext = (quality: number) => {
        if (!currentCard) return;
        db.saveReview(currentCard.id, quality);
        setIsFlipped(false);
        if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    if (!currentCard) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-[#E5E0D0]">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    <CheckCircle />
                </div>
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">All Caught Up!</h2>
                <p className="text-[#56636A]">You have reviewed all due Kanji for now.</p>
                <button onClick={onComplete} className="mt-6 text-[#D74B4B] font-bold hover:underline">Refresh</button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[#8E9AAF] font-bold uppercase text-xs tracking-wider">Review {currentIndex + 1} / {items.length}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold border border-red-200">Kanji</span>
             </div>

             <div className="perspective-1000 h-[450px] relative">
                 <div className={`relative w-full h-full transition-all duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => !isFlipped && setIsFlipped(true)}>
                    
                    {/* Front: Just the Kanji */}
                    <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-[#E5E0D0] flex flex-col items-center justify-center p-8">
                        <div className="text-[140px] font-japanese font-black text-[#2C2C2C] leading-tight">
                            {currentCard.question}
                        </div>
                        <p className="mt-8 text-[#D74B4B] font-bold animate-pulse text-sm">Tap to Reveal</p>
                    </div>

                    {/* Back: Details */}
                    <div className="absolute w-full h-full backface-hidden bg-[#2F3E46] text-[#F9F7E8] rounded-3xl shadow-xl rotate-y-180 border border-[#2F3E46] flex flex-col items-center justify-center p-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-2">{currentCard.meaning}</h2>
                        
                        <div className="w-full h-px bg-white/20 my-4"></div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <div className="text-right border-r border-white/20 pr-4">
                                <span className="block text-xs uppercase opacity-50 font-bold mb-1">On'yomi</span>
                                <span className="text-lg font-japanese">{currentCard.reading.split('|')[0]?.replace('On:', '') || '-'}</span>
                            </div>
                            <div className="text-left pl-4">
                                <span className="block text-xs uppercase opacity-50 font-bold mb-1">Kun'yomi</span>
                                <span className="text-lg font-japanese">{currentCard.reading.split('|')[1]?.replace('Kun:', '') || '-'}</span>
                            </div>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl w-full border border-white/10 mb-6">
                            <p className="font-japanese text-lg mb-1">{currentCard.example}</p>
                            <p className="text-gray-300 text-xs italic">{currentCard.exampleTranslation}</p>
                        </div>
                    </div>
                 </div>
             </div>

             {/* Controls (Only visible when flipped) */}
             {isFlipped && (
                 <div className="flex justify-center gap-3 mt-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <button onClick={() => handleNext(1)} className="flex-1 p-3 rounded-xl border border-red-200 bg-white text-red-600 font-bold text-sm hover:bg-red-50 transition-colors shadow-sm">Hard</button>
                    <button onClick={() => handleNext(3)} className="flex-1 p-3 rounded-xl border border-blue-200 bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm">Good</button>
                    <button onClick={() => handleNext(5)} className="flex-1 p-3 rounded-xl border border-green-200 bg-white text-green-600 font-bold text-sm hover:bg-green-50 transition-colors shadow-sm">Easy</button>
                 </div>
             )}

             <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
             `}</style>
        </div>
    );
};

// --- Sub-Component: Kanji Quiz (Updated Modes) ---
const KanjiQuiz: React.FC<{ level: JLPTLevel }> = ({ level }) => {
    const [mode, setMode] = useState<'reading' | 'meaning' | 'mix' | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const startQuiz = (selectedMode: 'reading' | 'meaning' | 'mix') => {
        const items = db.getContent(level, 'kanji');
        // Shuffle and pick 10 items
        const shuffled = [...items].sort(() => 0.5 - Math.random()).slice(0, 10);
        
        const generatedQs = shuffled.map(item => {
            // Determine question type based on mode
            let type: 'reading' | 'meaning' = selectedMode === 'mix' 
                ? (Math.random() > 0.5 ? 'reading' : 'meaning')
                : selectedMode;
            
            if (type === 'reading') {
                // Generate reading distractors
                const distractors = items
                    .filter(i => i.id !== item.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(i => {
                        // Extract a reading from the On/Kun string
                        const parts = i.reading.split('|').join(',').split(',').map(s => s.replace(/On:|Kun:/g, '').trim());
                        return parts[0] || 'Unknown';
                    });
                
                // Get correct reading
                const correctParts = item.reading.split('|').join(',').split(',').map(s => s.replace(/On:|Kun:/g, '').trim());
                const correctReading = correctParts[0] || 'Unknown';

                const allOpts = [...distractors, correctReading].sort(() => 0.5 - Math.random());

                return {
                    type: 'reading',
                    kanji: item.question,
                    question: `Select the correct reading for ${item.question}`,
                    options: allOpts,
                    correct: allOpts.indexOf(correctReading),
                    explanation: `${item.question} is read as "${correctReading}" (${item.meaning})`
                };
            } else {
                // Meaning quiz
                const distractors = items
                    .filter(i => i.id !== item.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(i => i.meaning);
                
                const allOpts = [...distractors, item.meaning].sort(() => 0.5 - Math.random());
                return {
                    type: 'meaning',
                    kanji: item.question,
                    question: `What does ${item.question} mean?`,
                    options: allOpts,
                    correct: allOpts.indexOf(item.meaning),
                    explanation: `${item.question} means "${item.meaning}".`
                };
            }
        });
        setQuestions(generatedQs);
        setMode(selectedMode);
        setCurrentQIndex(0);
        setScore(0);
        setFinished(false);
    };

    const handleAnswer = (idx: number) => {
        if (selectedOpt !== null) return;
        setSelectedOpt(idx);
        const correct = idx === questions[currentQIndex].correct;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);

        setTimeout(() => {
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
                setSelectedOpt(null);
                setIsCorrect(null);
            } else {
                setFinished(true);
            }
        }, 1500);
    };

    // --- Mode Selection Screen ---
    if (!mode) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2 font-japanese">Select Challenge Mode</h2>
                    <p className="text-[#56636A]">Choose how you want to test your Kanji knowledge.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button 
                        onClick={() => startQuiz('reading')}
                        className="bg-white p-8 rounded-3xl border border-[#E5E0D0] hover:border-[#D74B4B] shadow-sm hover:shadow-xl transition-all group text-left"
                    >
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <Languages className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">Reading Quiz</h3>
                        <p className="text-sm text-[#8E9AAF]">Test your ability to convert Kanji to Hiragana/Katakana readings.</p>
                    </button>

                    <button 
                        onClick={() => startQuiz('meaning')}
                        className="bg-white p-8 rounded-3xl border border-[#E5E0D0] hover:border-[#D74B4B] shadow-sm hover:shadow-xl transition-all group text-left"
                    >
                        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">Meaning Quiz</h3>
                        <p className="text-sm text-[#8E9AAF]">Test your vocabulary by matching Kanji to their English meanings.</p>
                    </button>

                    <button 
                        onClick={() => startQuiz('mix')}
                        className="bg-white p-8 rounded-3xl border border-[#E5E0D0] hover:border-[#D74B4B] shadow-sm hover:shadow-xl transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-[#D74B4B]">?</div>
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">Exam Mix</h3>
                        <p className="text-sm text-[#8E9AAF]">A randomized mix of reading and meaning questions. True mock style.</p>
                    </button>
                </div>
            </div>
        );
    }
    
    // --- Result Screen ---
    if (finished) {
        return (
            <div className="bg-white rounded-3xl p-10 text-center shadow-lg border border-[#E5E0D0] max-w-md mx-auto animate-in zoom-in duration-300">
                <h2 className="text-3xl font-bold font-japanese mb-4">Quiz Complete!</h2>
                <div className="text-6xl font-black text-[#D74B4B] mb-4">{Math.round((score / questions.length) * 100)}%</div>
                <p className="text-[#56636A] mb-8">You got {score} out of {questions.length} correct.</p>
                <div className="flex gap-4">
                    <button onClick={() => setMode(null)} className="flex-1 bg-[#EBE9DE] hover:bg-[#D5D0C0] text-[#2C2C2C] px-6 py-3 rounded-xl font-bold">New Mode</button>
                    <button onClick={() => startQuiz(mode)} className="flex-1 bg-[#2F3E46] hover:bg-[#1A262C] text-white px-6 py-3 rounded-xl font-bold">Retry</button>
                </div>
            </div>
        );
    }

    const curr = questions[currentQIndex];

    return (
        <div className="max-w-2xl mx-auto">
             <div className="bg-white rounded-3xl shadow-lg border border-[#E5E0D0] overflow-hidden">
                 <div className="bg-[#2F3E46] p-8 text-center relative">
                      <div className="absolute top-4 right-4 text-white/50 font-bold text-xs">
                          {currentQIndex + 1} / {questions.length}
                      </div>
                      
                      {/* Badge for Type */}
                      <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/80 mb-4">
                          {curr.type} Quiz
                      </div>

                      <div className="text-6xl text-white font-japanese font-bold mb-6">{curr.kanji}</div>
                      <h3 className="text-xl text-[#F9F7E8] font-bold">{curr.question}</h3>
                 </div>

                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                     {curr.options.map((opt: any, idx: number) => {
                         let style = "bg-white border-[#E5E0D0] hover:bg-[#F9F7E8] text-[#56636A]";
                         if (selectedOpt !== null) {
                             if (idx === curr.correct) style = "bg-green-100 border-green-300 text-green-700";
                             else if (idx === selectedOpt) style = "bg-red-100 border-red-300 text-red-700";
                             else style = "opacity-50";
                         }

                         return (
                            <button 
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={selectedOpt !== null}
                                className={`p-4 rounded-xl border-2 font-bold text-lg transition-all ${style}`}
                            >
                                {opt}
                            </button>
                         );
                     })}
                 </div>

                 {selectedOpt !== null && (
                     <div className={`p-4 text-center font-bold ${isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {isCorrect ? "Correct! " : "Incorrect. "} {curr.explanation}
                     </div>
                 )}
             </div>
        </div>
    );
};

export default KanjiPractice;
