import React, { useState } from 'react';
import { HIRAGANA_CHART, KATAKANA_CHART } from '../data/jlptData';
import { Volume2, Type } from 'lucide-react';

const Kana: React.FC = () => {
  const [tab, setTab] = useState<'hiragana' | 'katakana'>('hiragana');
  
  const currentChart = tab === 'hiragana' ? HIRAGANA_CHART : KATAKANA_CHART;

  const playSound = (char: string) => {
      if (!char) return;
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#2C2C2C] flex items-center gap-2 font-japanese">
                <Type className="w-8 h-8 text-[#D74B4B]" /> 
                {tab === 'hiragana' ? 'Hiragana Mastery' : 'Katakana Mastery'}
            </h2>
            <p className="text-[#56636A]">Click a card to hear the pronunciation.</p>
          </div>
          
          <div className="bg-white p-1.5 rounded-2xl flex gap-2 border border-[#E5E0D0]">
              <button 
                onClick={() => setTab('hiragana')}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${tab === 'hiragana' ? 'bg-[#2F3E46] text-[#F9F7E8] shadow-md' : 'text-[#8E9AAF] hover:bg-[#F0EFE9] hover:text-[#2C2C2C]'}`}
              >
                  あ Hiragana
              </button>
              <button 
                onClick={() => setTab('katakana')}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${tab === 'katakana' ? 'bg-[#2F3E46] text-[#F9F7E8] shadow-md' : 'text-[#8E9AAF] hover:bg-[#F0EFE9] hover:text-[#2C2C2C]'}`}
              >
                  ア Katakana
              </button>
          </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#E5E0D0]">
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
                      {/* Romaji Watermark */}
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
    </div>
  );
};

export default Kana;