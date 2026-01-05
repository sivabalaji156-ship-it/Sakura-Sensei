import { UserProfile, StudyItem, SRSStatus, TestResult, JLPTLevel, Question, Badge } from '../types';
import { MOCK_QUESTIONS, BADGES } from '../constants';
import { FULL_JLPT_CONTENT, READING_MATERIALS } from '../data/jlptData';

// --- Database Keys ---
const DB_USERS = 'sakura_users_v6_indigo'; // Bump version to clear old pink data/users if needed, or keep compatible
const DB_CURRENT_USER_ID = 'sakura_current_user_id';
const DB_SRS = 'sakura_srs';
const DB_RESULTS = 'sakura_results';

// --- Event Emitter for Badges ---
type BadgeListener = (badge: Badge) => void;
let badgeListeners: BadgeListener[] = [];

// Allow UI components to subscribe to badge unlocks
export const onBadgeUnlock = (fn: BadgeListener) => {
    badgeListeners.push(fn);
    return () => {
        badgeListeners = badgeListeners.filter(l => l !== fn);
    };
};

const notifyBadgeUnlock = (badgeId: string) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
        badgeListeners.forEach(fn => fn(badge));
    }
};

interface StoredUser extends UserProfile {
    password?: string;
}

const DEMO_USER: StoredUser = {
  id: 'demo-uuid-123',
  username: 'sakura_fan',
  name: 'Sato Kenji',
  password: 'password',
  level: 'N5',
  examDate: '2025-07-01',
  dailyGoalMinutes: 30,
  streak: 5,
  xp: 850,
  badges: ['streak_3', 'glorious_purpose'],
  isOnboarded: true,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji'
};

const getStorage = <T>(key: string, def: T): T => {
    try {
        const s = localStorage.getItem(key);
        return s ? JSON.parse(s) : def;
    } catch (e) {
        return def;
    }
};

const setStorage = (key: string, val: any) => {
    localStorage.setItem(key, JSON.stringify(val));
};

const generateId = () => {
    try {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
    } catch (e) { }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const initDb = () => {
    const users = getStorage<StoredUser[]>(DB_USERS, []);
    if (!users.some(u => u.username === DEMO_USER.username)) {
        users.push(DEMO_USER);
        setStorage(DB_USERS, users);
    }
};

initDb();

export const db = {
    login: async (username: string, pass: string): Promise<UserProfile> => {
        await new Promise(r => setTimeout(r, 800));
        
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const user = users.find(u => u.username === username);
        
        if (!user) throw new Error("User ID not found. Please register.");
        if (user.password && user.password !== pass) throw new Error("Incorrect password.");
        
        setStorage(DB_CURRENT_USER_ID, user.id);
        const { password, ...profile } = user;
        return profile;
    },

    register: async (name: string, username: string, pass: string): Promise<UserProfile> => {
        await new Promise(r => setTimeout(r, 800));
        
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        if (users.find(u => u.username === username)) {
            throw new Error("This User ID is already taken.");
        }

        const newUser: StoredUser = {
            id: generateId(),
            name,
            username,
            password: pass,
            level: 'N5', // Default start
            examDate: '', 
            dailyGoalMinutes: 15,
            streak: 0,
            xp: 0,
            badges: [],
            isOnboarded: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
        };

        users.push(newUser);
        setStorage(DB_USERS, users);
        const { password, ...profile } = newUser;
        return profile;
    },

    logout: () => {
        localStorage.removeItem(DB_CURRENT_USER_ID);
    },

    getCurrentUser: (): UserProfile | null => {
        const id = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!id) return null;
        
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const user = users.find(u => u.id === id);
        if (!user) {
            localStorage.removeItem(DB_CURRENT_USER_ID);
            return null;
        }
        const { password, ...profile } = user;
        return profile;
    },

    updateUser: (updates: Partial<UserProfile>) => {
        const id = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!id) return;
        
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
            const oldUser = users[idx];
            const newUser = { ...oldUser, ...updates };
            
            // Check for new badges to notify
            if (updates.badges) {
                const oldBadges = new Set(oldUser.badges);
                updates.badges.forEach(b => {
                    if (!oldBadges.has(b)) {
                        notifyBadgeUnlock(b);
                    }
                });
            }

            users[idx] = newUser;
            setStorage(DB_USERS, users);
        }
    },

    getContent: (level: JLPTLevel, type?: 'kanji' | 'vocabulary' | 'grammar'): StudyItem[] => {
        let items = FULL_JLPT_CONTENT.filter(i => i.level === level);
        if (type) items = items.filter(i => i.type === type);
        return items;
    },
    
    getReadingMaterials: (level: JLPTLevel) => {
        return READING_MATERIALS.filter(r => r.level === level);
    },

    getProgress: (level: JLPTLevel) => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return { kanji: 0, vocabulary: 0, grammar: 0 };

        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        const levelItems = FULL_JLPT_CONTENT.filter(i => i.level === level);
        
        const counts = { kanji: 0, vocabulary: 0, grammar: 0 };
        const totals = { kanji: 0, vocabulary: 0, grammar: 0 };

        levelItems.forEach(item => {
            totals[item.type]++;
            const key = `${userId}:${item.id}`;
            if (srsData[key] && srsData[key].streak > 0) {
                counts[item.type]++;
            }
        });

        return {
            kanji: totals.kanji === 0 ? 0 : Math.round((counts.kanji / totals.kanji) * 100),
            vocabulary: totals.vocabulary === 0 ? 0 : Math.round((counts.vocabulary / totals.vocabulary) * 100),
            grammar: totals.grammar === 0 ? 0 : Math.round((counts.grammar / totals.grammar) * 100),
        };
    },

    getExamQuestions: (level: JLPTLevel): Question[] => {
        return MOCK_QUESTIONS;
    },

    saveReview: (itemId: string, quality: number) => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return;

        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        const key = `${userId}:${itemId}`;
        
        const current = srsData[key] || { itemId, nextReview: Date.now(), interval: 0, easeFactor: 2.5, streak: 0 };
        
        if (quality >= 3) {
            if (current.streak === 0) current.interval = 1;
            else if (current.streak === 1) current.interval = 3;
            else current.interval = Math.round(current.interval * current.easeFactor);
            current.streak++;
        } else {
            current.streak = 0;
            current.interval = 0.5;
        }

        current.nextReview = Date.now() + (current.interval * 24 * 60 * 60 * 1000);
        srsData[key] = current;
        setStorage(DB_SRS, srsData);

        // --- BADGE LOGIC CHECK ---
        const user = db.getCurrentUser();
        if(user) {
            const learnedCount = Object.keys(srsData).filter(k => k.startsWith(userId) && srsData[k].streak > 0).length;
            const newBadges: string[] = [];
            const hour = new Date().getHours();

            // Session Count Badges
            if (learnedCount % 5 === 0) {
                 const badgeId = `session_${learnedCount}`;
                 if (BADGES.find(b => b.id === badgeId) && !user.badges.includes(badgeId)) {
                     newBadges.push(badgeId);
                 }
            }
            
            // Total Learned Badges
            ['10', '25', '50'].forEach(milestone => {
                const bId = `total_kanji_${milestone}`;
                if(learnedCount >= parseInt(milestone) && !user.badges.includes(bId) && BADGES.find(b => b.id === bId)) {
                    newBadges.push(bId);
                }
            });

            // Time Badges
            if (hour >= 22 && !user.badges.includes('night_owl')) {
                newBadges.push('night_owl');
            }
            if (hour < 7 && !user.badges.includes('early_bird')) {
                newBadges.push('early_bird');
            }

            // Scholar Badge
            if (learnedCount >= 50 && !user.badges.includes('scholar')) {
                newBadges.push('scholar');
            }

            if(newBadges.length > 0) {
                db.updateUser({ badges: [...user.badges, ...newBadges] });
            }
        }
    },

    getDueItems: (level: JLPTLevel): StudyItem[] => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return []; 

        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        const allItems = FULL_JLPT_CONTENT.filter(i => i.level === level);
        const now = Date.now();
        
        const due = allItems.filter(item => {
            const key = `${userId}:${item.id}`;
            const status = srsData[key];
            if (!status) return false;
            return status.nextReview <= now;
        });

        if (due.length < 10) {
            const newItems = allItems.filter(item => {
                const key = `${userId}:${item.id}`;
                return !srsData[key];
            }).slice(0, 10 - due.length);
            return [...due, ...newItems];
        }

        return due;
    },

    saveTestResult: (result: Omit<TestResult, 'userId'>) => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) throw new Error("Must be logged in to save results");

        const results = getStorage<TestResult[]>(DB_RESULTS, []);
        const fullResult: TestResult = { ...result, userId };
        results.push(fullResult);
        setStorage(DB_RESULTS, results);
        
        const user = db.getCurrentUser();
        if (user) {
            const newBadges: string[] = [];
            
            // Perfect Score Badge
            if (result.score === result.total) {
                // Exam Level Badge
                const levelBadgeId = `exam_${result.level}`;
                if (!user.badges.includes(levelBadgeId)) {
                    newBadges.push(levelBadgeId);
                }
                
                // Flawless Victory Badge
                if (!user.badges.includes('flawless_victory')) {
                    newBadges.push('flawless_victory');
                }
            }

            if (newBadges.length > 0) {
                db.updateUser({ badges: [...user.badges, ...newBadges] });
            }
        }
    },

    getTestHistory: (): TestResult[] => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return [];
        const results = getStorage<TestResult[]>(DB_RESULTS, []);
        return results.filter(r => r.userId === userId);
    }
};