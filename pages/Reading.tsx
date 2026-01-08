
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { ReadingMaterial } from '../types';
import { BookOpen, HelpCircle, ChevronDown, Book } from 'lucide-react';

const Reading: React.FC = () => {
  const [materials, setMaterials] = useState<ReadingMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  // Grouping state if we still want to group, or just expanding individual items.
  // Given the requirement for specific lessons, a simple list or grouped by chunks is fine.
  // The new data has unique titles.
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    // Load materials for current user level
    const currentUser = db.getCurrentUser();
    const level = currentUser?.level || 'N5';
    const levelMaterials = db.getReadingMaterials(level);
    setMaterials(levelMaterials);
  }, []);

  const handleSelect = (m: ReadingMaterial) => {
      setSelectedMaterial(m);
      setAnswers({});
      setShowResults(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (qId: string, optionIdx: number) => {
      if (showResults) return;
      setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  // Group materials by blocks of 5 for easier navigation
  const groupedMaterials = materials.reduce((acc, curr) => {
      const start = Math.floor((curr.lesson - 1) / 5) * 5 + 1;
      const end = start + 4;
      const groupKey = `Lessons ${start} - ${end}`;
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(curr);
      return acc;
  }, {} as Record<string, ReadingMaterial[]>);

  const toggleGroup = (id: string) => {
      setExpandedGroup(prev => prev === id ? null : id);
  }

  if (selectedMaterial) {
      return (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => setSelectedMaterial(null)} className="mb-4 text-[#D74B4B] font-bold hover:underline flex items-center gap-1">
                  ← Back to Library
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Text Section */}
                  <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#E5E0D0] h-fit">
                      <div className="flex items-center gap-2 mb-4">
                          <span className="bg-[#EBE9DE] text-[#56636A] border border-[#D5D0C0] px-3 py-1 rounded-full text-xs font-bold">{selectedMaterial.level}</span>
                          <span className="bg-[#D74B4B]/10 text-[#D74B4B] border border-[#D74B4B]/20 px-3 py-1 rounded-full text-xs font-bold">L{selectedMaterial.lesson}</span>
                      </div>
                      <h2 className="text-2xl font-bold font-japanese text-[#2C2C2C] mb-6">{selectedMaterial.title}</h2>
                      
                      <div className="prose prose-lg text-[#2C2C2C] font-japanese leading-loose mb-8 text-lg whitespace-pre-wrap">
                          {selectedMaterial.content}
                      </div>
                      
                      <div className="bg-[#F9F7E8] p-4 rounded-xl border border-[#E5E0D0]">
                          <h4 className="font-bold text-[#56636A] text-sm mb-2 uppercase">Translation</h4>
                          <p className="text-[#8E9AAF] italic text-sm whitespace-pre-wrap">{selectedMaterial.translation}</p>
                      </div>
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-6">
                      <h3 className="text-xl font-bold text-[#2C2C2C] flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-[#D74B4B]" /> Comprehension Check
                      </h3>
                      {selectedMaterial.questions.map((q, idx) => (
                          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D0]">
                              <p className="font-bold text-[#2C2C2C] mb-4">{idx + 1}. {q.question}</p>
                              <div className="space-y-2">
                                  {q.options.map((opt, oIdx) => {
                                      let style = "border-[#E5E0D0] hover:bg-[#F9F7E8] text-[#56636A]";
                                      if (answers[q.id] === oIdx) style = "border-[#D74B4B] bg-[#D74B4B]/10 text-[#D74B4B] ring-1 ring-[#D74B4B]";
                                      
                                      if (showResults) {
                                          if (oIdx === q.correctIndex) style = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                                          else if (answers[q.id] === oIdx) style = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                                      }

                                      return (
                                        <button 
                                            key={oIdx}
                                            onClick={() => handleAnswer(q.id, oIdx)}
                                            className={`w-full text-left p-3 rounded-lg border transition-all ${style}`}
                                        >
                                            {opt}
                                        </button>
                                      );
                                  })}
                              </div>
                              {showResults && (
                                  <div className="mt-4 p-3 bg-[#F0EFE9] rounded-lg text-sm text-[#56636A] border border-[#E5E0D0]">
                                      <span className="font-bold text-[#D74B4B]">Explanation: </span> {q.explanation}
                                  </div>
                              )}
                          </div>
                      ))}

                      {!showResults ? (
                          <button 
                            onClick={() => setShowResults(true)}
                            className="w-full bg-[#D74B4B] text-white font-bold py-3 rounded-xl hover:bg-[#BC002D] transition-all shadow-lg shadow-[#D74B4B]/30"
                          >
                              Check Answers
                          </button>
                      ) : (
                          <div className="text-center p-4 bg-green-50 text-green-700 rounded-xl font-bold border border-green-200">
                              Section Completed!
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-[#2C2C2C] font-japanese">Reading Library</h2>
                <p className="text-[#56636A]">Improve comprehension with leveled stories.</p>
            </div>
        </div>

        <div className="space-y-4">
            {Object.keys(groupedMaterials).sort((a,b) => parseInt(a.match(/\d+/)?.[0]||'0') - parseInt(b.match(/\d+/)?.[0]||'0')).map((groupName) => (
                <div key={groupName} className="bg-white rounded-2xl shadow-sm border border-[#E5E0D0] overflow-hidden">
                    <button 
                        onClick={() => toggleGroup(groupName)}
                        className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-[#F9F7E8] transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 rounded-xl text-white shadow-sm bg-[#D74B4B]">
                                <Book className="w-5 h-5" />
                            </span>
                            <h3 className="text-lg font-bold text-[#2C2C2C] font-japanese">{groupName}</h3>
                        </div>
                        <div className={`p-1 rounded-full transition-transform duration-300 ${expandedGroup === groupName ? 'rotate-180 bg-[#E5E0D0]' : ''}`}>
                            <ChevronDown className="w-5 h-5 text-[#8E9AAF]" />
                        </div>
                    </button>

                    {expandedGroup === groupName && (
                        <div className="p-5 border-t border-[#E5E0D0] bg-[#FDFCF8] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                            {groupedMaterials[groupName].sort((a,b) => a.lesson - b.lesson).map(m => (
                                <div 
                                    key={m.id}
                                    onClick={() => handleSelect(m)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D0] hover:shadow-lg hover:border-[#D74B4B]/50 hover:-translate-y-1 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-[#F9F7E8] text-[#56636A] border border-[#D5D0C0]">
                                            Lesson {m.lesson}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold font-japanese mb-2 text-[#2C2C2C] group-hover:text-[#D74B4B] transition-colors line-clamp-1">{m.title}</h3>
                                    <p className="text-[#8E9AAF] text-sm line-clamp-2">{m.translation}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default Reading;
