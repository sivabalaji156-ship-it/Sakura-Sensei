
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JLPTLevel, StudyItem } from '../types';
import { db } from '../services/db';
import { explainGrammar } from '../services/geminiService';
import { 
    ArrowLeft, 
    Volume2, 
    BookOpen, 
    Layers, 
    Plus, 
    Sparkles, 
    X, 
    Save, 
    Loader2, 
    PenTool,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface ModuleDetailProps {
  level: JLPTLevel;
  type?: 'kanji' | 'vocabulary' | 'grammar'; // Optional type override
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ level, type: propType }) => {
  const { type: paramType } = useParams<{ type: string }>();
  // Use propType if provided (e.g. from KanjiPractice), otherwise use paramType from URL
  const type = propType || paramType; 
  
  const [items, setItems] = useState<StudyItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<Record<string, StudyItem[]>>({});
  
  // Modal State
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // AI Explanation State
  const [explanation, setExplanation] = useState<{id: string, text: string} | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<string | null>(null);

  // Custom Item State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ question: '', reading: '', meaning: '', example: '', exampleTranslation: '' });

  const loadData = () => {
    if (type) {
        const data = db.getContent(level, type as any);
        setItems(data);

        // Group by Lesson
        const groups: Record<string, StudyItem[]> = {};
        data.forEach(item => {
            let lessonKey = "General Library";
            if (item.id.startsWith('custom_')) {
                lessonKey = "Custom Vocabulary";
            } else if (item.lesson) {
                // Use the specific lesson title if available, otherwise fallback to "Lesson X"
                lessonKey = item.lessonTitle 
                    ? `Lesson ${item.lesson}: ${item.lessonTitle}` 
                    : `Lesson ${item.lesson}`;
            }
            
            if (!groups[lessonKey]) groups[lessonKey] = [];
            groups[lessonKey].push(item);
        });
        setGroupedItems(groups);
    }
  };

  useEffect(() => {
    loadData();
    setSelectedGroup(null);
  }, [level, type]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const handleExplain = async (item: StudyItem) => {
    if (explanation?.id === item.id) {
        setExplanation(null); // toggle off
        return;
    }
    setLoadingExplanation(item.id);
    const text = await explainGrammar(item.question, level);
    setExplanation({ id: item.id, text });
    setLoadingExplanation(null);
  };

  const handleSaveCustom = () => {
    if(!newItem.question || !newItem.meaning) return;
    const item: StudyItem = {
        id: `custom_${Date.now()}`,
        level,
        type: 'vocabulary',
        ...newItem
    };
    db.addCustomItem(item);
    loadData();
    setShowAddModal(false);
    setNewItem({ question: '', reading: '', meaning: '', example: '', exampleTranslation: '' });
  };

  const formattedType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';

  // Sort lessons: Custom first, then numerically by Lesson ID found in string
  const sortedKeys = Object.keys(groupedItems).sort((a, b) => {
      if (a === 'Custom Vocabulary') return -1; 
      if (b === 'Custom Vocabulary') return 1;
      
      const numA = parseInt(a.match(/Lesson (\d+)/)?.[1] || "9999");
      const numB = parseInt(b.match(/Lesson (\d+)/)?.[1] || "9999");
      return numA - numB;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 relative pb-20">
        {!propType && (
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/study" className="p-2 bg-white rounded-lg border border-[#E5E0D0] hover:bg-[#EBE9DE] text-[#56636A]">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#2C2C2C] font-japanese">{level} {formattedType} Library</h1>
                </div>
                
                {type === 'vocabulary' && (
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#D74B4B] hover:bg-[#BC002D] text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-[#D74B4B]/30 flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-5 h-5" /> Add Word
                    </button>
                )}
            </div>
        )}

        {items.length === 0 && (
            <div className="text-center py-20 text-[#8E9AAF] bg-white rounded-3xl border border-[#E5E0D0] border-dashed">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No content loaded for this section yet.</p>
                {type === 'vocabulary' && (
                    <button onClick={() => setShowAddModal(true)} className="mt-4 text-[#D74B4B] font-bold hover:underline">
                        Add your first word
                    </button>
                )}
            </div>
        )}

        {/* --- GRID LAYOUT (SQUARE CARDS) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedKeys.map((groupKey, idx) => {
                const count = groupedItems[groupKey].length;
                const isCustom = groupKey === 'Custom Vocabulary';
                const lessonNum = groupKey.match(/Lesson (\d+)/)?.[1];
                
                return (
                    <MotionDiv
                        key={groupKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedGroup(groupKey)}
                        className={`aspect-square p-5 rounded-2xl shadow-sm border cursor-pointer group flex flex-col relative overflow-hidden transition-all ${
                            isCustom 
                            ? 'bg-orange-50 border-orange-200 hover:border-orange-400' 
                            : 'bg-white border-[#E5E0D0] hover:border-[#D74B4B]/50 hover:shadow-lg'
                        }`}
                    >
                        {/* Background Decoration */}
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform ${isCustom ? 'bg-orange-500' : 'bg-[#D74B4B]'}`} />
                        
                        <div className="flex justify-between items-start mb-auto">
                            <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded-md ${isCustom ? 'bg-orange-100 text-orange-600' : 'bg-[#F9F7E8] text-[#8E9AAF]'}`}>
                                {isCustom ? 'User' : `Unit ${lessonNum || '?'}`}
                            </span>
                            {isCustom ? <PenTool className="w-4 h-4 text-orange-400" /> : <BookOpen className="w-4 h-4 text-[#D74B4B]" />}
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-bold text-[#2C2C2C] font-japanese leading-tight line-clamp-2 mb-1 group-hover:text-[#D74B4B] transition-colors">
                                {groupKey.replace(/Lesson \d+: /, '')}
                            </h3>
                            <p className="text-xs text-[#56636A] font-medium">{count} Items</p>
                        </div>

                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#8E9AAF] uppercase tracking-widest group-hover:text-[#D74B4B] transition-colors">
                            Open <ChevronRight className="w-3 h-3" />
                        </div>
                    </MotionDiv>
                );
            })}
        </div>

        {/* --- MODAL FOR CONTENT --- */}
        <AnimatePresence>
            {selectedGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedGroup(null)}
                        className="absolute inset-0 bg-[#2C2C2C]/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#F9F7E8] w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-white border-b border-[#E5E0D0] flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-[#2C2C2C] font-japanese">{selectedGroup}</h2>
                                <p className="text-sm text-[#8E9AAF]">{groupedItems[selectedGroup].length} terms to master</p>
                            </div>
                            <button 
                                onClick={() => setSelectedGroup(null)}
                                className="p-2 bg-[#F9F7E8] rounded-full hover:bg-[#EBE9DE] transition-colors"
                            >
                                <X className="w-6 h-6 text-[#56636A]" />
                            </button>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#F9F7E8]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedItems[selectedGroup].map(item => (
                                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E0D0] hover:border-[#D74B4B]/30 transition-all group flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-japanese font-black text-[#2C2C2C] group-hover:text-[#D74B4B] transition-colors">{item.question}</h3>
                                            <div className="flex gap-1">
                                                {type === 'grammar' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleExplain(item); }} 
                                                        className={`p-1.5 rounded-full hover:bg-[#F0EFE9] transition-all ${explanation?.id === item.id ? 'bg-[#D74B4B] text-white' : 'text-[#8E9AAF] hover:text-[#D74B4B]'}`}
                                                        title="Ask Sensei"
                                                    >
                                                        {loadingExplanation === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); speak(item.question); }} 
                                                    className="p-1.5 rounded-full hover:bg-[#F0EFE9] text-[#8E9AAF] hover:text-[#D74B4B]"
                                                >
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <p className="text-[#D74B4B] font-japanese text-sm font-bold mb-1 leading-snug">{item.reading}</p>
                                            <p className="text-[#56636A] font-bold text-sm mb-3 border-b border-[#E5E0D0] pb-2 w-full">{item.meaning}</p>
                                            <div className="bg-[#F9F7E8] p-2.5 rounded-lg text-xs border border-[#E5E0D0] group-hover:bg-[#FFFDE7] transition-colors">
                                                <p className="font-japanese text-[#2C2C2C] mb-1 font-medium">{item.example}</p>
                                                <p className="text-[#8E9AAF] italic">{item.exampleTranslation}</p>
                                            </div>
                                            
                                            {/* AI Explanation Injection */}
                                            {explanation?.id === item.id && (
                                                <div className="mt-3 bg-[#2F3E46] text-white p-3 rounded-lg text-xs animate-in fade-in zoom-in duration-200 border border-gray-700">
                                                    <div className="flex items-center gap-2 mb-1 text-[#D74B4B] font-bold">
                                                        <span>🌸 Sensei Note</span>
                                                    </div>
                                                    <div className="opacity-90 leading-relaxed whitespace-pre-wrap">{explanation.text}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Custom Item Modal (Add Word) */}
        {showAddModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto border border-[#E5E0D0]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#2C2C2C] font-japanese">Add Custom Word</h2>
                        <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 text-[#8E9AAF]" /></button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#8E9AAF] uppercase mb-1">Word / Kanji</label>
                            <input 
                                value={newItem.question}
                                onChange={e => setNewItem({...newItem, question: e.target.value})}
                                className="w-full p-3 rounded-xl border border-[#E5E0D0] bg-[#F9F7E8] focus:ring-2 focus:ring-[#D74B4B] outline-none font-japanese"
                                placeholder="e.g. 桜"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#8E9AAF] uppercase mb-1">Reading (Furigana)</label>
                            <input 
                                value={newItem.reading}
                                onChange={e => setNewItem({...newItem, reading: e.target.value})}
                                className="w-full p-3 rounded-xl border border-[#E5E0D0] bg-[#F9F7E8] focus:ring-2 focus:ring-[#D74B4B] outline-none font-japanese"
                                placeholder="e.g. さくら (sakura)"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#8E9AAF] uppercase mb-1">Meaning</label>
                            <input 
                                value={newItem.meaning}
                                onChange={e => setNewItem({...newItem, meaning: e.target.value})}
                                className="w-full p-3 rounded-xl border border-[#E5E0D0] bg-[#F9F7E8] focus:ring-2 focus:ring-[#D74B4B] outline-none"
                                placeholder="e.g. Cherry Blossom"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#8E9AAF] uppercase mb-1">Example Sentence</label>
                            <textarea 
                                value={newItem.example}
                                onChange={e => setNewItem({...newItem, example: e.target.value})}
                                className="w-full p-3 rounded-xl border border-[#E5E0D0] bg-[#F9F7E8] focus:ring-2 focus:ring-[#D74B4B] outline-none font-japanese"
                                placeholder="e.g. 桜がとてもきれいです。"
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#8E9AAF] uppercase mb-1">Translation</label>
                            <input 
                                value={newItem.exampleTranslation}
                                onChange={e => setNewItem({...newItem, exampleTranslation: e.target.value})}
                                className="w-full p-3 rounded-xl border border-[#E5E0D0] bg-[#F9F7E8] focus:ring-2 focus:ring-[#D74B4B] outline-none"
                                placeholder="e.g. The cherry blossoms are very beautiful."
                            />
                        </div>

                        <button 
                            onClick={handleSaveCustom}
                            disabled={!newItem.question || !newItem.meaning}
                            className="w-full bg-[#2F3E46] text-white py-4 rounded-xl font-bold hover:bg-[#1A262C] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" /> Save to Collection
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ModuleDetail;
