import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JLPTLevel, StudyItem } from '../types';
import { db } from '../services/db';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface ModuleDetailProps {
  level: JLPTLevel;
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ level }) => {
  const { type } = useParams<{ type: string }>();
  const [items, setItems] = useState<StudyItem[]>([]);
  
  useEffect(() => {
    if (type) {
        const data = db.getContent(level, type as any);
        setItems(data);
    }
  }, [level, type]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const formattedType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';

  return (
    <div>
        <div className="flex items-center gap-4 mb-6">
            <Link to="/study" className="p-2 bg-white rounded-lg border border-[#E5E0D0] hover:bg-[#EBE9DE] text-[#56636A]">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#2C2C2C] font-japanese">{level} {formattedType} List</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-[#E5E0D0] hover:border-[#D74B4B]/50 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-japanese font-bold text-[#2C2C2C]">{item.question}</h3>
                            <button onClick={() => speak(item.question)} className="p-1.5 rounded-full hover:bg-[#EBE9DE] text-[#8E9AAF] hover:text-[#D74B4B]">
                                <Volume2 className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-xs bg-[#EBE9DE] text-[#56636A] px-2 py-1 rounded border border-[#D5D0C0]">{item.level}</span>
                    </div>
                    <p className="text-[#D74B4B] font-japanese text-sm mb-1">{item.reading}</p>
                    <p className="text-[#56636A] font-bold mb-3">{item.meaning}</p>
                    
                    <div className="bg-[#F9F7E8] p-3 rounded-lg text-sm border border-[#E5E0D0]">
                        <p className="font-japanese text-[#2C2C2C] mb-1">{item.example}</p>
                        <p className="text-[#8E9AAF] text-xs italic">{item.exampleTranslation}</p>
                    </div>
                </div>
            ))}
            
            {items.length === 0 && (
                <div className="col-span-full text-center py-10 text-[#8E9AAF]">
                    <p>No content loaded for this simulated backend yet.</p>
                    <p className="text-sm">Try N5 Vocabulary!</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ModuleDetail;