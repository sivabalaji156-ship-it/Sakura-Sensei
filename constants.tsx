import React from 'react';
import { Badge } from './types';

export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

// Empty string for now to prevent errors
export const UNLOCK_SOUND = ""; 

// --- Streak Data (Anime Power Scaling) ---
export const STREAK_LEVELS = [
    { days: 3, name: 'Training Arc Start', icon: '🪵', description: 'Maintained a 3-day streak' },
    { days: 7, name: 'Super Saiyan', icon: '👱', description: 'Maintained a 7-day streak' },
    { days: 14, name: 'Plus Ultra', icon: '🦸', description: 'Maintained a 14-day streak' },
    { days: 30, name: 'Hokage Way', icon: '🍥', description: 'Maintained a 30-day streak' },
    { days: 60, name: 'Titan Shifter', icon: '⚡', description: 'Maintained a 60-day streak' },
    { days: 100, name: 'One Punch', icon: '👊', description: 'Maintained a 100-day streak' },
    { days: 365, name: 'God Tier', icon: '♾️', description: 'Maintained a 365-day streak' }
];

// --- Badge Generation System ---
const generateBadges = (): Badge[] => {
    const badges: Badge[] = [];
    
    // 0. SPECIAL: First Login
    badges.push({
        id: 'glorious_purpose',
        name: 'Glorious Purpose',
        icon: '🌀',
        description: 'Logging in for the first time.',
        category: 'Special'
    });

    // 1. Streak Badges (Using extracted constant)
    STREAK_LEVELS.forEach((s) => {
        badges.push({
            id: `streak_${s.days}`,
            name: s.name,
            icon: s.icon,
            description: s.description,
            category: 'Streak'
        });
    });

    // 2. Level Mastery Badges (Rankings)
    const levelNames: Record<string, string> = { 
        N5: 'Genin', 
        N4: 'Chunin', 
        N3: 'Jonin', 
        N2: 'Hashira', 
        N1: 'Sorcerer King' 
    };
    const levelIcons: Record<string, string> = { 
        N5: '🍃', 
        N4: '⚔️', 
        N3: '🥷', 
        N2: '👺', 
        N1: '👑' 
    };

    LEVELS.forEach(level => {
        badges.push({ 
            id: `master_${level}`, 
            name: `${level} ${levelNames[level]}`, 
            icon: levelIcons[level], 
            description: `Completed all ${level} modules`, 
            category: 'Mastery' 
        });
    });

    // 3. Exam Passers
    const examNames: Record<string, string> = {
        N5: 'Hunter License',
        N4: 'State Alchemist',
        N3: 'Special Grade',
        N2: 'S-Class Hero',
        N1: 'Pirate King'
    };
    
    LEVELS.forEach(level => {
        badges.push({ 
            id: `exam_${level}`, 
            name: examNames[level], 
            icon: '📜', 
            description: `Passed the ${level} Mock Exam`, 
            category: 'Exam' 
        });
    });

    // 4. Volume Badges (Kanji/Vocab)
    const counts = [10, 50, 100, 200, 500, 1000];
    const kanjiTitles = ['Death Note Writer', 'Unlimited Blade Works', 'Domain Expansion', 'Gate of Babylon', 'Akashic Records', 'Omniscient Reader'];
    const vocabTitles = ['Baka!', 'Nakama', 'Dattebayo', 'Yare Yare Daze', 'Omae wa mou shindeiru', 'Subarashii'];

    counts.forEach((count, i) => {
        badges.push({ 
            id: `total_kanji_${count}`, 
            name: kanjiTitles[i] || `${count} Kanji`, 
            icon: '✒️', 
            description: `Learned ${count} Kanji`, 
            category: 'Kanji' 
        });
        badges.push({ 
            id: `total_vocab_${count}`, 
            name: vocabTitles[i] || `${count} Words`, 
            icon: '🗣️', 
            description: `Learned ${count} Words`, 
            category: 'Vocab' 
        });
    });

    // 5. Session Badges
    const sessionData = [
        { count: 5, name: 'Shadow Clone', icon: '👤' },
        { count: 10, name: 'Spirit Gun', icon: '👈' },
        { count: 25, name: 'Rasengan', icon: '🔵' },
        { count: 50, name: 'Kamehameha', icon: '👐' },
        { count: 100, name: 'Serious Series', icon: '🥊' }
    ];

    sessionData.forEach((s) => {
        badges.push({
            id: `session_${s.count}`,
            name: s.name,
            icon: s.icon,
            description: `Completed ${s.count} study sessions`,
            category: 'Time'
        });
    });

    // 6. NEW: Performance & Time Badges
    badges.push({
        id: 'flawless_victory',
        name: 'Flawless Victory',
        icon: '✨',
        description: 'Score 100% on any Mock Exam',
        category: 'Exam'
    });

    badges.push({
        id: 'night_owl',
        name: 'Night Owl',
        icon: '🦉',
        description: 'Complete a review session after 10 PM',
        category: 'Time'
    });
    
    badges.push({
        id: 'early_bird',
        name: 'Early Bird',
        icon: '🌅',
        description: 'Complete a review session before 7 AM',
        category: 'Time'
    });
    
    badges.push({
        id: 'scholar',
        name: 'Scholar',
        icon: '📚',
        description: 'Review 50 distinct items',
        category: 'Mastery'
    });

    return badges;
};

export const BADGES: Badge[] = generateBadges();
export const MOCK_QUESTIONS = [
    {
        id: 'm1',
        type: 'vocabulary' as const,
        question: '学生 (Student) - Reading?',
        options: ['Gakusei', 'Sensei', 'Kaishain', 'Isha'],
        correctIndex: 0,
        explanation: '学生 is read as Gakusei.'
    },
    {
        id: 'm2',
        type: 'grammar' as const,
        question: '私は寿司＿好きです。 (I like sushi)',
        options: ['を', 'が', 'は', 'に'],
        correctIndex: 1,
        explanation: 'With "suki" (like), we typically use the particle "ga" (が).'
    },
    {
        id: 'm3',
        type: 'kanji' as const,
        question: 'Select the Kanji for "Japan"',
        options: ['日本', '中国', '韓国', '米国'],
        correctIndex: 0,
        explanation: '日本 (Nihon) means Japan.'
    }
];