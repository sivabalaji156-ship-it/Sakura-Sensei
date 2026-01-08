
import React from 'react';
import { Badge } from './types';
import { 
    Leaf, 
    Scroll, 
    Swords, 
    Flame, 
    Crown, 
    Zap, 
    Rocket, 
    Target, 
    Infinity, 
    Feather, 
    Languages, 
    Hourglass, 
    GraduationCap, 
    Sparkles, 
    Moon, 
    Sun, 
    Library, 
    Trophy,
    Medal,
    Sword,
    Wind,
    Dumbbell,
    Skull
} from 'lucide-react';

export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

// Empty string for now to prevent errors
export const UNLOCK_SOUND = ""; 

// --- AVAILABLE AVATARS (Shonen/Manga Style) ---
export const AVATAR_OPTIONS = [
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Kaito&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Akira&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Hana&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Ryu&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Yuki&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Kenji&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Sakura&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Takeshi&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Nami&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Sora&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Ren&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Mika&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Hiro&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Asuka&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Shinji&backgroundColor=d1d4f9"
];

// --- Streak Data (Anime Power Scaling) ---
export const STREAK_LEVELS = [
    { days: 3, name: 'Training Arc Start', icon: Leaf, color: 'text-emerald-500', description: 'Maintained a 3-day streak' },
    { days: 7, name: 'Super Saiyan', icon: Zap, color: 'text-yellow-500', description: 'Maintained a 7-day streak' },
    { days: 14, name: 'Plus Ultra', icon: Flame, color: 'text-orange-600', description: 'Maintained a 14-day streak' },
    { days: 30, name: 'Hokage Way', icon: Scroll, color: 'text-amber-700', description: 'Maintained a 30-day streak' },
    { days: 60, name: 'Titan Shifter', icon: Target, color: 'text-red-600', description: 'Maintained a 60-day streak' },
    { days: 100, name: 'One Punch', icon: Dumbbell, color: 'text-stone-600', description: 'Maintained a 100-day streak' },
    { days: 365, name: 'God Tier', icon: Infinity, color: 'text-indigo-600', description: 'Maintained a 365-day streak' }
];

// --- Badge Generation System ---
const generateBadges = (): Badge[] => {
    const badges: Badge[] = [];
    
    // 0. SPECIAL: First Login
    badges.push({
        id: 'glorious_purpose',
        name: 'Glorious Purpose',
        icon: Rocket,
        color: 'text-indigo-600',
        description: 'Logging in for the first time.',
        category: 'Special'
    });

    // 1. Streak Badges (Using extracted constant)
    STREAK_LEVELS.forEach((s) => {
        badges.push({
            id: `streak_${s.days}`,
            name: s.name,
            icon: s.icon,
            color: s.color,
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
    const levelIcons: Record<string, any> = { 
        N5: Leaf, 
        N4: Scroll, 
        N3: Swords, 
        N2: Flame, 
        N1: Crown 
    };
    const levelColors: Record<string, string> = { 
        N5: 'text-emerald-500', 
        N4: 'text-amber-600', 
        N3: 'text-slate-600', 
        N2: 'text-red-600', 
        N1: 'text-yellow-500' 
    };

    LEVELS.forEach(level => {
        badges.push({ 
            id: `master_${level}`, 
            name: `${level} ${levelNames[level]}`, 
            icon: levelIcons[level], 
            color: levelColors[level],
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
    const examColors: Record<string, string> = {
        N5: 'text-lime-600',
        N4: 'text-teal-600',
        N3: 'text-cyan-600',
        N2: 'text-indigo-600',
        N1: 'text-fuchsia-600'
    };
    
    LEVELS.forEach(level => {
        badges.push({ 
            id: `exam_${level}`, 
            name: examNames[level], 
            icon: GraduationCap, 
            color: examColors[level],
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
            icon: Feather, 
            color: 'text-stone-700',
            description: `Learned ${count} Kanji`, 
            category: 'Kanji' 
        });
        badges.push({ 
            id: `total_vocab_${count}`, 
            name: vocabTitles[i] || `${count} Words`, 
            icon: Languages, 
            color: 'text-sky-600',
            description: `Learned ${count} Words`, 
            category: 'Vocab' 
        });
    });

    // 5. Session Badges
    const sessionData = [
        { count: 5, name: 'Shadow Clone', icon: Hourglass, color: 'text-blue-400' },
        { count: 10, name: 'Spirit Gun', icon: Target, color: 'text-blue-500' },
        { count: 25, name: 'Rasengan', icon: Sparkles, color: 'text-cyan-500' },
        { count: 50, name: 'Kamehameha', icon: Zap, color: 'text-orange-500' },
        { count: 100, name: 'Serious Series', icon: Trophy, color: 'text-yellow-500' }
    ];

    sessionData.forEach((s) => {
        badges.push({
            id: `session_${s.count}`,
            name: s.name,
            icon: s.icon,
            color: s.color,
            description: `Completed ${s.count} study sessions`,
            category: 'Time'
        });
    });

    // 6. NEW: Performance & Time Badges
    badges.push({
        id: 'flawless_victory',
        name: 'Flawless Victory',
        icon: Medal,
        color: 'text-yellow-400',
        description: 'Score 100% on any Mock Exam',
        category: 'Exam'
    });

    badges.push({
        id: 'night_owl',
        name: 'Night Owl',
        icon: Moon,
        color: 'text-indigo-400',
        description: 'Complete a review session after 10 PM',
        category: 'Time'
    });
    
    badges.push({
        id: 'early_bird',
        name: 'Early Bird',
        icon: Sun,
        color: 'text-orange-400',
        description: 'Complete a review session before 7 AM',
        category: 'Time'
    });
    
    badges.push({
        id: 'scholar',
        name: 'Scholar',
        icon: Library,
        color: 'text-amber-800',
        description: 'Review 50 distinct items',
        category: 'Mastery'
    });

    // 7. NEW: Kana Quiz Badges
    badges.push({
        id: 'kana_hashira',
        name: 'Hiragana Hashira',
        icon: Scroll,
        color: 'text-emerald-500',
        description: 'Get a perfect score on the Hiragana Quiz',
        category: 'Kana'
    });

    badges.push({
        id: 'katakana_titan',
        name: 'Katakana Titan',
        icon: Sword,
        color: 'text-red-500',
        description: 'Get a perfect score on the Katakana Quiz',
        category: 'Kana'
    });

    badges.push({
        id: 'thunder_breathing',
        name: 'Thunder Breathing',
        icon: Wind,
        color: 'text-yellow-500',
        description: 'Complete a Kana quiz in under 30 seconds with 100% accuracy',
        category: 'Kana'
    });

    // 8. DISRESPECT BADGE
    badges.push({
        id: 'mongrel',
        name: 'Mongrel',
        icon: Skull,
        color: 'text-stone-500',
        description: "Made a mistake? 'Zasshu! Know your place!' - Gilgamesh",
        category: 'Shame'
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
