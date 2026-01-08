
import React, { useState, useEffect, useRef } from 'react';
import { JLPTLevel } from '../types';
import { db } from '../services/db';
import { ListeningMaterial } from '../types';
import { 
    Play, 
    Pause, 
    SkipForward, 
    SkipBack, 
    Headphones, 
    ChevronDown, 
    CheckCircle, 
    MoreHorizontal,
    ChevronRight,
    ArrowLeft,
    Disc,
    ListMusic,
    Clock,
    Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface ListeningProps {
  level: JLPTLevel;
}

const Listening: React.FC<ListeningProps> = ({ level }) => {
  const [materials, setMaterials] = useState<ListeningMaterial[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<ListeningMaterial | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  
  // Audio Progress State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressInterval = useRef<any>(null);

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
      const data = db.getListeningMaterials(level);
      setMaterials(data);
  }, [level]);

  const parseDuration = (str: string) => {
      if(!str) return 0;
      const parts = str.split(':').map(Number);
      return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (selectedLesson) {
        setDuration(parseDuration(selectedLesson.duration));
        setCurrentTime(0);
        setIsPlaying(false);
        setAnswers({});
        setShowResults(false);
        window.speechSynthesis.cancel();
    }
  }, [selectedLesson]);

  // Progress Timer
  useEffect(() => {
      if (isPlaying && duration > 0) {
          progressInterval.current = setInterval(() => {
              setCurrentTime(prev => {
                  if (prev >= duration) {
                      setIsPlaying(false);
                      return duration;
                  }
                  return prev + 1;
              });
          }, 1000 / speed);
      } else {
          clearInterval(progressInterval.current);
      }
      return () => clearInterval(progressInterval.current);
  }, [isPlaying, duration, speed]);

  // Audio Playback
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (isPlaying && selectedLesson) {
        if (synth.paused) {
             synth.resume();
        } else if (!synth.speaking) {
             const utterance = new SpeechSynthesisUtterance(selectedLesson.audioScript);
             utterance.lang = 'ja-JP';
             utterance.rate = speed;
             utterance.onend = () => {
                 setIsPlaying(false);
                 setCurrentTime(duration);
             };
             utterance.onerror = () => setIsPlaying(false);
             synth.speak(utterance);
        }
    } else {
        if (synth.speaking) {
            synth.pause();
        }
    }
  }, [isPlaying, selectedLesson, speed, duration]);

  useEffect(() => {
      return () => {
          window.speechSynthesis.cancel();
          clearInterval(progressInterval.current);
      };
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleLessonSelect = (lesson: ListeningMaterial) => {
      setSelectedLesson(lesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextLesson = () => {
      if (!selectedLesson) return;
      const currentIndex = materials.findIndex(m => m.id === selectedLesson.id);
      if (currentIndex !== -1 && currentIndex < materials.length - 1) {
          handleLessonSelect(materials[currentIndex + 1]);
      }
  };

  const toggleGroup = (group: string) => {
      setExpandedGroup(prev => prev === group ? null : group);
  };

  const handleAnswer = (qId: string, idx: number) => {
      if (showResults) return;
      setAnswers(prev => ({ ...prev, [qId]: idx }));
  };

  const groupedMaterials = materials.reduce((acc, curr) => {
      const groupKey = `Lessons ${Math.floor((curr.lesson - 1) / 5) * 5 + 1} - ${Math.floor((curr.lesson - 1) / 5) * 5 + 5}`;
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(curr);
      return acc;
  }, {} as Record<string, ListeningMaterial[]>);

  // --- PLAYER VIEW ---
  if (selectedLesson) {
      const isLastLesson = materials.findIndex(m => m.id === selectedLesson.id) === materials.length - 1;

      return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Nav Bar */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => { setSelectedLesson(null); window.speechSynthesis.cancel(); }} 
                    className="p-2 bg-white rounded-xl border border-[#E5E0D0] text-[#56636A] hover:text-[#D74B4B] hover:border-[#D74B4B] transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-[#2C2C2C] font-japanese">{selectedLesson.title}</h2>
                    <p className="text-xs text-[#8E9AAF] font-bold">JLPT {level} • Lesson {selectedLesson.lesson}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- Left Column: Compact Player --- */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
                    
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#E5E0D0] relative overflow-hidden">
                        
                        {/* Simulated Vinyl Animation */}
                        <div className="flex justify-center mb-6 relative">
                             <motion.div 
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                                className="relative z-10 w-40 h-40 rounded-full bg-[#2C2C2C] border-4 border-[#2C2C2C] shadow-lg flex items-center justify-center"
                             >
                                 {/* Disc Details */}
                                 <div className="absolute inset-0 rounded-full border border-white/10" />
                                 <div className="absolute inset-4 rounded-full border border-white/5" />
                                 <div className="w-16 h-16 bg-[#D74B4B] rounded-full flex items-center justify-center">
                                     <div className="w-4 h-4 bg-black rounded-full" />
                                 </div>
                             </motion.div>
                             
                             {/* Music Note Floaties */}
                             <AnimatePresence>
                                {isPlaying && (
                                    <>
                                        <MotionDiv 
                                            initial={{ opacity: 0, y: 0, x: 0 }}
                                            animate={{ opacity: 1, y: -50, x: 20 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute top-0 right-10 text-[#D74B4B]"
                                        >♪</MotionDiv>
                                        <MotionDiv 
                                            initial={{ opacity: 0, y: 0, x: 0 }}
                                            animate={{ opacity: 1, y: -40, x: -20 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                            className="absolute top-10 left-10 text-[#2C2C2C]"
                                        >♫</MotionDiv>
                                    </>
                                )}
                             </AnimatePresence>
                        </div>

                        {/* Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-bold text-[#8E9AAF] font-mono mb-2">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                            <div className="h-1.5 bg-[#F0EFE9] rounded-full overflow-hidden relative">
                                <motion.div 
                                    className="h-full bg-[#D74B4B]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                    transition={{ ease: "linear", duration: 0.1 }}
                                />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-2">
                             <button onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 0.75 : 1)} className="text-xs font-bold text-[#8E9AAF] w-12 hover:text-[#2C2C2C]">
                                 {speed}x
                             </button>

                             <div className="flex items-center gap-4">
                                 <button onClick={() => setCurrentTime(Math.max(0, currentTime - 5))} className="p-2 text-[#2C2C2C] hover:text-[#D74B4B] hover:bg-[#F9F7E8] rounded-full transition-colors">
                                     <SkipBack className="w-6 h-6 fill-current" />
                                 </button>

                                 <button 
                                    onClick={togglePlay}
                                    className="w-14 h-14 bg-[#2C2C2C] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all hover:bg-[#D74B4B]"
                                 >
                                     {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                 </button>

                                 <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 5))} className="p-2 text-[#2C2C2C] hover:text-[#D74B4B] hover:bg-[#F9F7E8] rounded-full transition-colors">
                                     <SkipForward className="w-6 h-6 fill-current" />
                                 </button>
                             </div>

                             <div className="w-12 text-right">
                                 <MoreHorizontal className="w-5 h-5 text-[#E5E0D0] ml-auto" />
                             </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleNextLesson}
                        disabled={isLastLesson}
                        className="w-full py-4 bg-white border border-[#E5E0D0] rounded-2xl shadow-sm text-[#56636A] font-bold flex items-center justify-center gap-2 hover:bg-[#F9F7E8] hover:text-[#D74B4B] hover:border-[#D74B4B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* --- Right Column: Content --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Transcript Card */}
                    <div className="bg-[#FDFCF8] rounded-3xl border border-[#E5E0D0] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#D74B4B]/20" />
                        
                        <div className="flex items-center gap-2 mb-6 text-[#D74B4B]">
                            <ListMusic className="w-5 h-5" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Transcript</h3>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-xl font-japanese text-[#2C2C2C] leading-loose mb-6 font-medium">
                                {selectedLesson.audioScript}
                            </p>
                            <div className="p-4 bg-white rounded-xl border border-[#E5E0D0] text-[#56636A] text-sm leading-relaxed italic relative">
                                <Languages className="w-4 h-4 absolute top-4 right-4 text-[#E5E0D0]" />
                                {selectedLesson.transcript}
                            </div>
                        </div>
                    </div>

                    {/* Quiz Section */}
                    <div className="bg-white rounded-3xl border border-[#E5E0D0] p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Comprehension</h3>
                        </div>
                        
                        <div className="space-y-8">
                            {selectedLesson.questions.map((q, qIdx) => (
                                <div key={q.id}>
                                    <h4 className="font-bold text-[#2C2C2C] mb-4 text-base">
                                        {qIdx + 1}. {q.question}
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {q.options.map((opt, i) => {
                                            let stateStyle = "bg-white border-[#E5E0D0] text-[#56636A] hover:bg-[#F9F7E8] hover:border-[#8E9AAF]";
                                            if (answers[q.id] === i) stateStyle = "bg-[#2F3E46] border-[#2F3E46] text-white shadow-md";
                                            
                                            if (showResults) {
                                                if (i === q.correctIndex) stateStyle = "bg-green-100 border-green-500 text-green-800";
                                                else if (answers[q.id] === i) stateStyle = "bg-red-100 border-red-500 text-red-800";
                                                else stateStyle = "opacity-40 border-[#E5E0D0]";
                                            }

                                            return (
                                                <button 
                                                    key={i} 
                                                    onClick={() => handleAnswer(q.id, i)}
                                                    disabled={showResults}
                                                    className={`w-full text-left px-5 py-3 rounded-xl border-2 transition-all font-bold text-sm flex items-center justify-between group ${stateStyle}`}
                                                >
                                                    <span>{opt}</span>
                                                    {answers[q.id] === i && !showResults && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {showResults && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-3 text-sm text-[#56636A] bg-[#F0EFE9] p-4 rounded-xl border border-[#E5E0D0]"
                                        >
                                            <span className="font-black text-[#2C2C2C]">Sensei says:</span> {q.explanation}
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#E5E0D0]">
                            {!showResults ? (
                                <button 
                                    onClick={() => setShowResults(true)}
                                    className="w-full bg-[#D74B4B] text-white font-bold py-4 rounded-xl hover:bg-[#BC002D] transition-all shadow-lg shadow-[#D74B4B]/30"
                                >
                                    Check Answers
                                </button>
                            ) : (
                                <div className="text-center py-4 bg-green-50 text-green-700 rounded-xl font-bold border border-green-200 text-sm flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Lesson Completed
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- LIBRARY GRID VIEW ---
  return (
    <div className="max-w-6xl mx-auto pb-20">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2C2C2C] font-japanese flex items-center gap-3">
                <span className="bg-[#2F3E46] text-white p-2 rounded-xl"><Headphones className="w-6 h-6" /></span>
                Listening Library
            </h2>
            <p className="text-[#56636A] mt-2 ml-1">Train your ears with {level} audio lessons.</p>
        </div>

        <div className="space-y-8">
            {Object.keys(groupedMaterials).map((groupName) => (
                <div key={groupName}>
                    <div className="flex items-center gap-4 mb-4">
                         <h3 className="text-lg font-black text-[#8E9AAF] uppercase tracking-widest">{groupName}</h3>
                         <div className="h-px bg-[#E5E0D0] flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedMaterials[groupName].map(m => (
                            <MotionDiv 
                                key={m.id}
                                whileHover={{ y: -4 }}
                                onClick={() => handleLessonSelect(m)}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E0D0] hover:shadow-xl hover:border-[#D74B4B]/30 cursor-pointer group flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Disc className="w-24 h-24 text-[#2C2C2C]" />
                                </div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-[#F9F7E8] text-[#56636A] border border-[#D5D0C0]">
                                        Lesson {m.lesson}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-[#F0EFE9] flex items-center justify-center text-[#2C2C2C] group-hover:bg-[#D74B4B] group-hover:text-white transition-colors">
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold font-japanese mb-2 text-[#2C2C2C] group-hover:text-[#D74B4B] transition-colors line-clamp-1">{m.title}</h3>
                                <p className="text-[#8E9AAF] text-xs line-clamp-2 mb-4 flex-1">{m.description}</p>
                                
                                <div className="flex items-center gap-4 text-xs font-bold text-[#8E9AAF] pt-4 border-t border-[#F0EFE9] relative z-10">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {m.duration}</span>
                                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {m.questions.length} Qs</span>
                                </div>
                            </MotionDiv>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Listening;
