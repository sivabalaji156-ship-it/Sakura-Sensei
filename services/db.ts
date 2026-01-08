
import { UserProfile, StudyItem, SRSStatus, TestResult, JLPTLevel, Question, Badge, ListeningMaterial } from '../types';
import { MOCK_QUESTIONS, BADGES } from '../constants';
import { FULL_JLPT_CONTENT, READING_MATERIALS, LISTENING_MATERIALS } from '../data/jlptData';

// --- Database Keys (V2 for fresh start and stability) ---
const DB_PREFIX = 'sakura_sensei_v2_';
const DB_USERS = `${DB_PREFIX}users`;
const DB_CURRENT_USER_ID = `${DB_PREFIX}current_user_id`;
const DB_SRS = `${DB_PREFIX}srs`;
const DB_RESULTS = `${DB_PREFIX}results`;
const DB_CUSTOM_ITEMS = `${DB_PREFIX}custom_items`;

// --- Event Emitters ---
type BadgeListener = (badge: Badge) => void;
let badgeListeners: BadgeListener[] = [];

type UserListener = (user: UserProfile) => void;
let userListeners: UserListener[] = [];

// Subscribe to Badge Unlocks
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

// Subscribe to User Data Changes (XP, Streak, Level)
export const onUserUpdate = (fn: UserListener) => {
    userListeners.push(fn);
    return () => {
        userListeners = userListeners.filter(l => l !== fn);
    };
};

const notifyUserUpdate = (user: UserProfile) => {
    userListeners.forEach(fn => fn(user));
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
  lastStudyDate: new Date().toISOString().split('T')[0],
  xp: 850,
  badges: ['streak_3', 'glorious_purpose'],
  isOnboarded: true,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji'
};

// --- Storage Helpers ---

const getStorage = <T>(key: string, def: T): T => {
    if (typeof window === 'undefined' || !window.localStorage) return def;
    try {
        const s = localStorage.getItem(key);
        if (!s || s === 'undefined') return def;
        return JSON.parse(s);
    } catch (e) {
        console.warn(`SakuraSensei DB: Failed to parse ${key}`, e);
        return def;
    }
};

const setStorage = (key: string, val: any) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
        console.error(`SakuraSensei DB: Failed to save ${key}`, e);
    }
};

const generateId = () => {
    try {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
    } catch (e) { }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Helper to encode Unicode strings for Base64
const utf8_to_b64 = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)));
};

// Helper to decode Base64 strings to Unicode
const b64_to_utf8 = (str: string) => {
    return decodeURIComponent(escape(window.atob(str)));
};

// --- Initialization ---

const initDb = () => {
    const users = getStorage<StoredUser[]>(DB_USERS, []);
    
    // Ensure Demo User exists
    const demoExists = users.some(u => u.username === DEMO_USER.username);
    if (!demoExists) {
        users.push(DEMO_USER);
        setStorage(DB_USERS, users);
        console.log('SakuraSensei DB: Demo user initialized');
    }
};

// Run initialization immediately
initDb();

export const db = {
    // --- Auth ---

    login: async (username: string, pass: string): Promise<UserProfile> => {
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        
        if (!user) {
            console.error('Login failed: User not found', username);
            throw new Error("User ID not found. Did you register?");
        }
        
        if (user.password && user.password !== pass) {
            console.error('Login failed: Incorrect password');
            throw new Error("Incorrect password.");
        }
        
        setStorage(DB_CURRENT_USER_ID, user.id);
        const { password, ...profile } = user;
        
        // Trigger streak check on login
        setTimeout(() => db.checkDailyStreak(), 0);
        
        return profile;
    },

    register: async (name: string, username: string, pass: string): Promise<UserProfile> => {
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error("This User ID is already taken. Please choose another.");
        }

        const newUser: StoredUser = {
            id: generateId(),
            name,
            username,
            password: pass,
            level: 'N5',
            examDate: '', 
            dailyGoalMinutes: 15,
            streak: 1, // Start with 1 day streak
            lastStudyDate: new Date().toISOString().split('T')[0],
            xp: 0,
            badges: [],
            isOnboarded: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
        };

        users.push(newUser);
        setStorage(DB_USERS, users);
        console.log('SakuraSensei DB: New user registered', username);
        
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
            // Stale ID, clear it
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
            
            // Badge Notification Check
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
            
            // Notify app listeners
            const { password, ...profile } = newUser;
            notifyUserUpdate(profile);
        }
    },

    // --- Streak Logic ---
    checkDailyStreak: () => {
        const user = db.getCurrentUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];
        const lastDate = user.lastStudyDate;

        // 1. Already studied today
        if (lastDate === today) return;

        // Calculate yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        let updates: Partial<UserProfile> = {};

        if (lastDate === yesterdayStr) {
            // 2. Studied yesterday -> Increment streak
            newStreak = (user.streak || 0) + 1;
        } else if (lastDate && lastDate < yesterdayStr) {
            // 3. Gap larger than 1 day -> Reset streak
            newStreak = 1;
        } else if (!lastDate) {
            // 4. First time tracking or legacy user
            // If user has a streak but no date, assume they are continuing
            newStreak = user.streak > 0 ? user.streak : 1;
        }

        updates.streak = newStreak;
        updates.lastStudyDate = today;

        // Check for streak badges
        const streakBadges = [`streak_${newStreak}`];
        if (BADGES.some(b => b.id === streakBadges[0]) && !user.badges.includes(streakBadges[0])) {
            updates.badges = [...user.badges, streakBadges[0]];
        }

        db.updateUser(updates);
    },

    // --- Content & Progress ---

    addCustomItem: (item: StudyItem) => {
        const custom = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);
        custom.push(item);
        setStorage(DB_CUSTOM_ITEMS, custom);
    },

    getContent: (level: JLPTLevel, type?: 'kanji' | 'vocabulary' | 'grammar'): StudyItem[] => {
        let items = FULL_JLPT_CONTENT.filter(i => i.level === level);
        
        // Merge custom items
        const custom = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);
        const customFiltered = custom.filter(i => i.level === level);
        items = [...items, ...customFiltered];

        if (type) items = items.filter(i => i.type === type);
        return items;
    },
    
    getReadingMaterials: (level: JLPTLevel) => {
        return READING_MATERIALS.filter(r => r.level === level);
    },

    getListeningMaterials: (level: JLPTLevel): ListeningMaterial[] => {
        return LISTENING_MATERIALS.filter(l => l.level === level);
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
        
        // --- GAMIFICATION LOGIC ---
        // Also trigger daily streak check here in case they missed login but reviewed
        db.checkDailyStreak();

        const user = db.getCurrentUser();
        if(user) {
            let updates: Partial<UserProfile> = {};
            let newBadges = [...user.badges];
            let xpGain = 10; // Base XP for review

            // XP Boost for streak (SRS Item Streak)
            if (current.streak > 3) xpGain += 5;
            
            const learnedCount = Object.keys(srsData).filter(k => k.startsWith(userId) && srsData[k].streak > 0).length;
            
            // Badge Checks (Milestones)
            ['10', '25', '50', '100'].forEach(m => {
                 const bId = `total_kanji_${m}`;
                 if (learnedCount >= parseInt(m) && !user.badges.includes(bId) && BADGES.find(b => b.id === bId)) {
                     newBadges.push(bId);
                     xpGain += 100; // Bonus XP for badge
                 }
            });
            
            // Time Badge Checks
            const hour = new Date().getHours();
            if ((hour >= 22 || hour <= 4) && !user.badges.includes('night_owl')) {
                newBadges.push('night_owl');
                xpGain += 50;
            }
            if (hour >= 5 && hour <= 7 && !user.badges.includes('early_bird')) {
                newBadges.push('early_bird');
                xpGain += 50;
            }

            updates.xp = user.xp + xpGain;
            if (newBadges.length > user.badges.length) updates.badges = newBadges;

            db.updateUser(updates);
        }
    },

    // Updated to accept optional type filter
    getDueItems: (level: JLPTLevel, type?: 'kanji' | 'vocabulary' | 'grammar'): StudyItem[] => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return []; 

        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        let allItems = FULL_JLPT_CONTENT.filter(i => i.level === level);
        
        if (type) {
            allItems = allItems.filter(i => i.type === type);
        }

        const now = Date.now();
        
        const due = allItems.filter(item => {
            const key = `${userId}:${item.id}`;
            const status = srsData[key];
            if (!status) return false;
            return status.nextReview <= now;
        });

        // If few items due, add new ones to learn
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
        if (!userId) return;

        // Daily Activity
        db.checkDailyStreak();

        const results = getStorage<TestResult[]>(DB_RESULTS, []);
        const fullResult: TestResult = { ...result, userId };
        results.push(fullResult);
        setStorage(DB_RESULTS, results);
        
        // Mock Exam Badge Check
        const user = db.getCurrentUser();
        if (user && result.score === result.total) {
            if (!user.badges.includes('flawless_victory')) {
                db.updateUser({ 
                    badges: [...user.badges, 'flawless_victory'],
                    xp: user.xp + 500 
                });
            }
        } else if (user) {
            // XP for finishing exam
            db.updateUser({ xp: user.xp + (result.score * 10) });
        }
    },

    getTestHistory: (): TestResult[] => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return [];
        const results = getStorage<TestResult[]>(DB_RESULTS, []);
        return results.filter(r => r.userId === userId);
    },

    getDebugUsers: () => {
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        return users.map(u => ({ 
            username: u.username, 
            password: u.password, 
            name: u.name, 
            avatar: u.avatar,
            level: u.level 
        }));
    },

    // --- Cross-Device Sync (Import/Export) ---

    generateTransferCode: (userId: string) => {
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");

        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        const userSrs: Record<string, SRSStatus> = {};
        // Only get SRS items for this user
        Object.keys(srsData).forEach(key => {
            if (key.startsWith(`${userId}:`)) {
                userSrs[key] = srsData[key];
            }
        });

        const allResults = getStorage<TestResult[]>(DB_RESULTS, []);
        const userResults = allResults.filter(r => r.userId === userId);

        const customItems = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);

        const payload = {
            version: 1,
            user,
            srs: userSrs,
            results: userResults,
            customItems: customItems, // Include custom items in sync
            timestamp: Date.now()
        };

        return utf8_to_b64(JSON.stringify(payload));
    },

    restoreFromTransferCode: (code: string): UserProfile => {
        try {
            const jsonStr = b64_to_utf8(code);
            const payload = JSON.parse(jsonStr);
            
            if (!payload.user || !payload.srs) {
                throw new Error("Invalid transfer code format");
            }

            const { user, srs, results, customItems } = payload;

            // 1. Restore/Update User
            const users = getStorage<StoredUser[]>(DB_USERS, []);
            const existingIdx = users.findIndex(u => u.id === user.id);
            if (existingIdx !== -1) {
                // Merge data, preferring the import
                users[existingIdx] = { ...users[existingIdx], ...user };
            } else {
                users.push(user);
            }
            setStorage(DB_USERS, users);

            // 2. Restore SRS Data
            const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
            const mergedSrs = { ...srsData, ...srs };
            setStorage(DB_SRS, mergedSrs);

            // 3. Restore Results (Deduplicate by ID)
            const allResults = getStorage<TestResult[]>(DB_RESULTS, []);
            const existingIds = new Set(allResults.map(r => r.id));
            const newResults = results.filter((r: TestResult) => !existingIds.has(r.id));
            setStorage(DB_RESULTS, [...allResults, ...newResults]);

            // 4. Restore Custom Items (Deduplicate)
            if (customItems && Array.isArray(customItems)) {
                const currentCustom = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);
                const existingCustomIds = new Set(currentCustom.map(i => i.id));
                const newCustom = customItems.filter((i: StudyItem) => !existingCustomIds.has(i.id));
                setStorage(DB_CUSTOM_ITEMS, [...currentCustom, ...newCustom]);
            }
            
            // 5. Force Login Context
            setStorage(DB_CURRENT_USER_ID, user.id);

            const { password, ...profile } = user;
            return profile;
        } catch (e) {
            console.error(e);
            throw new Error("Invalid Transfer Code. Please ensure you copied the entire string.");
        }
    }
};