import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { StudyItem, JLPTLevel } from '../types';
import { RotateCw, Check, X, Loader2 } from 'lucide-react';

interface FlashcardsProps {
    level?: JLPTLevel;
}

const Flashcards: React.FC<FlashcardsProps> = ({ level = 'N5' }) => {
  const [items, setItems] = useState<StudyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = db.getContent(level as JLPTLevel);
    setItems(data);
    setLoading(false);
  }, [level]);

  const currentCard = items[currentIndex];

  const handleNext = (quality: number) => {
    db.saveReview(currentCard.id, quality);
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 200);
  };

  const flip = () => setIsFlipped(!isFlipped);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#D74B4B]" /></div>;
  if (!currentCard) return <div className="text-center p-10 text-[#8E9AAF]">No flashcards found for this level yet!</div>;

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C2C2C] font-japanese">Review Session</h2>
        <span className="text-[#56636A] font-mono">{currentIndex + 1} / {items.length}</span>
      </div>

      <div className="relative h-96 w-full perspective-1000 cursor-pointer" onClick={flip}>
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-[#E5E0D0] flex flex-col items-center justify-center p-8">
            <span className="px-3 py-1 bg-[#F9F7E8] text-[#56636A] rounded-full text-xs font-bold mb-8 uppercase tracking-wider border border-[#E5E0D0]">{currentCard.type}</span>
            <h3 className="text-6xl font-japanese font-bold text-[#2C2C2C] mb-4">{currentCard.question}</h3>
            <p className="text-[#D74B4B] text-sm animate-pulse">Tap to reveal</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-[#2F3E46] text-[#F9F7E8] rounded-3xl shadow-xl rotate-y-180 border border-[#2F3E46] flex flex-col items-center justify-center p-8 text-center">
             <div className="flex flex-col items-center">
                <h3 className="text-4xl font-japanese font-bold mb-2 text-white">{currentCard.reading}</h3>
                <h4 className="text-2xl text-[#FF8A80] font-bold mb-6">{currentCard.meaning}</h4>
                
                <div className="bg-white/10 p-4 rounded-xl w-full border border-white/10">
                    <p className="font-japanese text-lg mb-1">{currentCard.example}</p>
                    <p className="text-gray-300 text-sm italic">{currentCard.exampleTranslation}</p>
                </div>
             </div>
          </div>

        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button 
            onClick={(e) => { e.stopPropagation(); handleNext(0); }}
            className="flex flex-col items-center gap-1 group"
        >
            <div className="w-14 h-14 rounded-full bg-white text-red-500 flex items-center justify-center border-2 border-[#E5E0D0] group-hover:border-red-500 transition-all shadow-md">
                <X className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#8E9AAF] group-hover:text-red-500">Hard</span>
        </button>

        <button 
            onClick={(e) => { e.stopPropagation(); flip(); }}
            className="flex flex-col items-center gap-1 group"
        >
            <div className="w-14 h-14 rounded-full bg-white text-[#56636A] flex items-center justify-center border-2 border-[#E5E0D0] group-hover:border-[#56636A] transition-all shadow-md">
                <RotateCw className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#8E9AAF] group-hover:text-[#56636A]">Flip</span>
        </button>

        <button 
            onClick={(e) => { e.stopPropagation(); handleNext(5); }}
            className="flex flex-col items-center gap-1 group"
        >
            <div className="w-14 h-14 rounded-full bg-white text-green-500 flex items-center justify-center border-2 border-[#E5E0D0] group-hover:border-green-500 transition-all shadow-md">
                <Check className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#8E9AAF] group-hover:text-green-500">Easy</span>
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcards;