
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, PenTool, Type, Headphones, MessageSquare } from 'lucide-react';
import { JLPTLevel } from '../types';

interface StudyModulesProps {
  level: JLPTLevel;
}

const modules = [
  { id: 'vocabulary', title: 'Vocabulary', subtitle: '語彙 (Goi)', icon: Book, color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { id: 'grammar', title: 'Grammar', subtitle: '文法 (Bunpou)', icon: PenTool, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: 'kanji', title: 'Kanji', subtitle: '漢字 (Kanji)', icon: Type, color: 'bg-red-100 text-red-600 border-red-200', link: '/kanji-practice' },
  { id: 'listening', title: 'Listening', subtitle: '聴解 (Choukai)', icon: Headphones, color: 'bg-emerald-100 text-emerald-600 border-emerald-200', link: '/listening' },
  { id: 'reading', title: 'Reading', subtitle: '読解 (Dokkai)', icon: MessageSquare, color: 'bg-purple-100 text-purple-600 border-purple-200', link: '/reading' },
];

const StudyModules: React.FC<StudyModulesProps> = ({ level }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-[#2C2C2C] font-japanese">Study Modules</h2>
            <p className="text-[#56636A]">Structured lessons for JLPT {level}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link 
            to={module.link || `/study/${module.id}`}
            key={module.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D0] hover:shadow-lg hover:border-[#D74B4B]/50 hover:-translate-y-1 transition-all duration-300 text-left group block"
          >
            <div className={`w-14 h-14 rounded-2xl ${module.color} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <module.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2C2C] font-japanese">{module.title}</h3>
            <p className="text-sm font-japanese text-[#8E9AAF] mb-4">{module.subtitle}</p>
            
            <div className="w-full bg-[#EBE9DE] rounded-full h-1.5 mb-2 overflow-hidden">
                <div className="bg-[#8E9AAF] h-1.5 rounded-full w-[30%] group-hover:bg-[#D74B4B] transition-colors"></div>
            </div>
            <p className="text-xs text-[#8E9AAF] group-hover:text-[#D74B4B] transition-colors">View Content →</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudyModules;