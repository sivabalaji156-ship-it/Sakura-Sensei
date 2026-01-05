import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Question } from '../types';
import { Timer, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MockExam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for demo
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions based on user level (mock N5 for now)
    const qs = db.getExamQuestions('N5');
    setQuestions(qs);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isFinished || loading) return;
    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                finishExam();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, loading]);

  const currentQ = questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleCheck = () => {
    setShowResult(true);
    if (selectedOption === currentQ.correctIndex) {
        setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        finishExam();
    }
  };

  const finishExam = () => {
    setIsFinished(true);
    db.saveTestResult({
        id: Date.now().toString(),
        date: Date.now(),
        score: score, 
        total: questions.length,
        type: 'mock',
        level: 'N5'
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return <div className="text-center p-10 text-[#2C2C2C]">Loading Exam...</div>;

  if (isFinished) {
    return (
        <div className="max-w-xl mx-auto text-center pt-10">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#E5E0D0]">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border border-yellow-200">
                    🏆
                </div>
                <h2 className="text-3xl font-bold text-[#2C2C2C] font-japanese mb-2">Exam Completed!</h2>
                <p className="text-[#56636A] mb-8">Great effort! Here is how you performed.</p>

                <div className="text-6xl font-bold text-[#D74B4B] mb-2">
                    {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-[#8E9AAF] font-bold mb-8">Score: {score} / {questions.length}</p>

                <div className="flex gap-4">
                    <Link 
                        to="/"
                        className="flex-1 bg-[#EBE9DE] hover:bg-[#D5D0C0] text-[#56636A] font-bold py-3 rounded-xl transition-all"
                    >
                        Back Home
                    </Link>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="flex-1 bg-[#D74B4B] hover:bg-[#BC002D] text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-lg border border-[#E5E0D0]">
        <div className="flex items-center gap-2 text-[#56636A]">
            <Timer className="w-5 h-5 text-[#D74B4B]" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
        </div>
        <div className="h-2 w-32 bg-[#EBE9DE] rounded-full overflow-hidden">
            <div 
                className="h-full bg-[#D74B4B] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E5E0D0] overflow-hidden">
        <div className="bg-[#F9F7E8] p-6 border-b border-[#E5E0D0] flex justify-between items-center">
             <span className="text-sm font-bold text-[#8E9AAF] uppercase tracking-wider">{currentQ.type}</span>
             <span className="text-sm font-bold text-[#8E9AAF]">Question {currentQuestionIndex + 1}</span>
        </div>
        
        <div className="p-8">
            <h2 className="text-xl font-japanese font-bold text-[#2C2C2C] mb-8 leading-relaxed">
                {currentQ.question}
            </h2>

            <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                    let btnClass = "border-[#E5E0D0] hover:border-[#D74B4B] hover:bg-[#F9F7E8] text-[#56636A]";
                    if (selectedOption === idx) {
                        btnClass = "border-[#D74B4B] bg-[#D74B4B]/10 text-[#D74B4B] ring-1 ring-[#D74B4B]";
                    }
                    if (showResult) {
                        if (idx === currentQ.correctIndex) btnClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                        else if (selectedOption === idx) btnClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                        else btnClass = "opacity-50 border-[#E5E0D0]";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={showResult}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full p-4 rounded-xl border-2 text-left font-japanese text-lg transition-all ${btnClass}`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>

            {/* Explanation Area */}
            {showResult && (
                <div className={`mt-6 p-4 rounded-xl flex gap-3 ${selectedOption === currentQ.correctIndex ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {selectedOption === currentQ.correctIndex ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                    <div>
                        <p className="font-bold mb-1">{selectedOption === currentQ.correctIndex ? 'Correct!' : 'Incorrect'}</p>
                        <p className="text-sm opacity-90">{currentQ.explanation}</p>
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 bg-[#F9F7E8] border-t border-[#E5E0D0] flex justify-end">
            {!showResult ? (
                <button 
                    onClick={handleCheck}
                    disabled={selectedOption === null}
                    className="bg-[#EBE9DE] hover:bg-[#D5D0C0] text-[#2C2C2C] font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            ) : (
                <button 
                    onClick={handleNext}
                    className="bg-[#D74B4B] hover:bg-[#BC002D] text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                    {currentQuestionIndex === questions.length - 1 ? "Finish Exam" : "Next Question"}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default MockExam;