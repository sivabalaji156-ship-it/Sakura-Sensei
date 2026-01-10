
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Clock, 
    CheckCircle2, 
    AlertTriangle, 
    BookOpen, 
    Ear, 
    FileText,
    Target
} from 'lucide-react';
import { JLPTLevel } from '../types';

interface ExamInfo {
    level: JLPTLevel;
    totalPass: number;
    totalScore: string;
    sections: {
        name: string;
        time: string;
        icon: React.ElementType;
        color: string;
    }[];
    scoring: {
        section: string;
        range: string;
        passMark: string;
    }[];
}

const EXAM_DATA: Record<JLPTLevel, ExamInfo> = {
    'N5': {
        level: 'N5',
        totalPass: 80,
        totalScore: '0–180',
        sections: [
            { name: 'Vocabulary', time: '20 min', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
            { name: 'Grammar + Reading', time: '40 min', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
            { name: 'Listening', time: '30 min', icon: Ear, color: 'bg-emerald-100 text-emerald-600' }
        ],
        scoring: [
            { section: 'Language Knowledge (Vocab/Grammar) & Reading', range: '0–120', passMark: '38' },
            { section: 'Listening', range: '0–60', passMark: '19' }
        ]
    },
    'N4': {
        level: 'N4',
        totalPass: 90,
        totalScore: '0–180',
        sections: [
            { name: 'Vocabulary', time: '25 min', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
            { name: 'Grammar + Reading', time: '55 min', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
            { name: 'Listening', time: '35 min', icon: Ear, color: 'bg-emerald-100 text-emerald-600' }
        ],
        scoring: [
            { section: 'Language Knowledge (Vocab/Grammar) & Reading', range: '0–120', passMark: '38' },
            { section: 'Listening', range: '0–60', passMark: '19' }
        ]
    },
    'N3': {
        level: 'N3',
        totalPass: 95,
        totalScore: '0–180',
        sections: [
            { name: 'Vocabulary', time: '30 min', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
            { name: 'Grammar + Reading', time: '70 min', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
            { name: 'Listening', time: '40 min', icon: Ear, color: 'bg-emerald-100 text-emerald-600' }
        ],
        scoring: [
            { section: 'Language Knowledge (Vocab/Grammar)', range: '0–60', passMark: '19' },
            { section: 'Reading', range: '0–60', passMark: '19' },
            { section: 'Listening', range: '0–60', passMark: '19' }
        ]
    },
    'N2': {
        level: 'N2',
        totalPass: 90,
        totalScore: '0–180',
        sections: [
            { name: 'Language Knowledge (Vocab/Grammar) + Reading', time: '105 min', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
            { name: 'Listening', time: '50 min', icon: Ear, color: 'bg-emerald-100 text-emerald-600' }
        ],
        scoring: [
            { section: 'Language Knowledge (Vocab/Grammar)', range: '0–60', passMark: '19' },
            { section: 'Reading', range: '0–60', passMark: '19' },
            { section: 'Listening', range: '0–60', passMark: '19' }
        ]
    },
    'N1': {
        level: 'N1',
        totalPass: 100,
        totalScore: '0–180',
        sections: [
            { name: 'Language Knowledge (Vocab/Grammar) + Reading', time: '110 min', icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
            { name: 'Listening', time: '60 min', icon: Ear, color: 'bg-emerald-100 text-emerald-600' }
        ],
        scoring: [
            { section: 'Language Knowledge (Vocab/Grammar)', range: '0–60', passMark: '19' },
            { section: 'Reading', range: '0–60', passMark: '19' },
            { section: 'Listening', range: '0–60', passMark: '19' }
        ]
    }
};

const ExamRules: React.FC = () => {
    const [activeLevel, setActiveLevel] = useState<JLPTLevel>('N5');
    const data = EXAM_DATA[activeLevel];

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="mb-8">
                <Link to="/dashboard" className="text-sm font-bold text-[#8E9AAF] hover:text-[#D74B4B] mb-2 inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-black text-[#2C2C2C] font-japanese flex items-center gap-3">
                    <Target className="w-8 h-8 text-[#D74B4B]" />
                    JLPT Guidebook
                </h1>
                <p className="text-[#56636A] mt-2">Official Examination Patterns & Scoring Rules.</p>
            </div>

            {/* Level Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar">
                {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map(lvl => (
                    <button
                        key={lvl}
                        onClick={() => setActiveLevel(lvl)}
                        className={`px-6 py-3 rounded-xl font-bold text-lg transition-all border-2 whitespace-nowrap ${
                            activeLevel === lvl
                            ? 'bg-[#2F3E46] text-[#F9F7E8] border-[#2F3E46] shadow-lg'
                            : 'bg-white text-[#56636A] border-[#E5E0D0] hover:border-[#D74B4B] hover:text-[#D74B4B]'
                        }`}
                    >
                        {lvl} Level
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column: Test Sections & Time */}
                <div className="md:col-span-2 space-y-8">
                    
                    {/* Time Allocation Card */}
                    <div className="bg-white rounded-3xl p-8 border border-[#E5E0D0] shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock className="w-6 h-6 text-[#D74B4B]" />
                            <h2 className="text-xl font-bold text-[#2C2C2C]">Test Sections & Time</h2>
                        </div>

                        <div className="space-y-4">
                            {data.sections.map((section, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-[#F9F7E8] rounded-xl border border-[#E5E0D0]">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${section.color}`}>
                                            <section.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-[#2C2C2C] text-sm md:text-base">{section.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-lg text-[#2C2C2C] bg-white px-3 py-1 rounded-lg border border-[#E5E0D0]">
                                        {section.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scoring Breakdown Card */}
                    <div className="bg-white rounded-3xl p-8 border border-[#E5E0D0] shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-bold text-[#2C2C2C]">Scoring Criteria</h2>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[#E5E0D0]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#2F3E46] text-[#F9F7E8]">
                                        <th className="p-4 font-bold text-sm">Section</th>
                                        <th className="p-4 font-bold text-sm">Range</th>
                                        <th className="p-4 font-bold text-sm">Pass Mark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.scoring.map((score, idx) => (
                                        <tr key={idx} className="border-b border-[#E5E0D0] last:border-0 bg-white">
                                            <td className="p-4 text-sm font-bold text-[#2C2C2C]">{score.section}</td>
                                            <td className="p-4 text-sm text-[#56636A] font-mono">{score.range}</td>
                                            <td className="p-4 text-sm font-bold text-[#D74B4B]">{score.passMark}</td>
                                        </tr>
                                    ))}
                                    {/* Overall Row */}
                                    <tr className="bg-[#FFF8E1]">
                                        <td className="p-4 text-sm font-black text-[#2C2C2C] uppercase tracking-wider">Overall Requirement</td>
                                        <td className="p-4 text-sm font-black text-[#2C2C2C] font-mono">{data.totalScore}</td>
                                        <td className="p-4 text-sm font-black text-[#D74B4B] text-lg">{data.totalPass}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column: Important Rules */}
                <div className="md:col-span-1">
                    <div className="bg-red-50 rounded-3xl p-6 border border-red-200 sticky top-24">
                        <div className="flex items-center gap-2 mb-4 text-red-700">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Critical Rule</h3>
                        </div>
                        <p className="text-red-900 text-sm leading-relaxed font-medium mb-4">
                            You must pass <strong>BOTH</strong> the total score requirement AND the sectional pass marks.
                        </p>
                        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm text-sm text-[#56636A]">
                            <p className="mb-2">Even if your total score is <strong>180/180</strong>...</p>
                            <p>If you score below the sectional pass mark in ANY section, the result is <span className="font-bold text-red-600">FAIL</span>.</p>
                        </div>
                    </div>

                    {/* Fun Fact / Tip */}
                    <div className="mt-6 bg-[#2F3E46] rounded-3xl p-6 text-[#F9F7E8] relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                💡 Sensei's Tip
                            </h3>
                            <p className="text-sm opacity-90 leading-relaxed">
                                Don't neglect Listening! Many students focus heavily on Kanji and Grammar but fail because they miss the sectional cutoff for Listening.
                            </p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-[#D74B4B] opacity-20">
                            <Ear className="w-24 h-24" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExamRules;
