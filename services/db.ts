
import { UserProfile, StudyItem, SRSStatus, TestResult, JLPTLevel, Question, Badge, ListeningMaterial } from '../types';
import { MOCK_QUESTIONS, BADGES } from '../constants';
import { FULL_JLPT_CONTENT, READING_MATERIALS, LISTENING_MATERIALS } from '../data/jlptData';

// --- Database Keys (V2) ---
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

const getStorage = <T>(key: string, def: T): T => {
    if (typeof window === 'undefined' || !window.localStorage) return def;
    try {
        const s = localStorage.getItem(key);
        if (!s || s === 'undefined') return def;
        return JSON.parse(s);
    } catch (e) {
        return def;
    }
};

const setStorage = (key: string, val: any) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { }
};

const generateId = () => {
    try {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
    } catch (e) { }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const utf8_to_b64 = (str: string) => window.btoa(unescape(encodeURIComponent(str)));
const b64_to_utf8 = (str: string) => decodeURIComponent(escape(window.atob(str)));

const initDb = () => {
    const users = getStorage<StoredUser[]>(DB_USERS, []);
    const demoExists = users.some(u => u.username === DEMO_USER.username);
    if (!demoExists) {
        users.push(DEMO_USER);
        setStorage(DB_USERS, users);
    }
};

initDb();

// --- Promotion Logic ---
const XP_THRESHOLDS: Record<JLPTLevel, number> = {
    'N5': 1000,
    'N4': 2500,
    'N3': 5000,
    'N2': 9000,
    'N1': 15000
};

const LEVELS_ORDER: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const checkLevelUp = (user: UserProfile): Partial<UserProfile> => {
    const currentIdx = LEVELS_ORDER.indexOf(user.level);
    if (currentIdx === -1 || currentIdx === LEVELS_ORDER.length - 1) return {};

    const threshold = XP_THRESHOLDS[user.level];
    if (user.xp >= threshold) {
        const nextLevel = LEVELS_ORDER[currentIdx + 1];
        // Only promote if they have passed at least one mock exam for current level with > 70%?
        // For now, simpler: XP based promotion.
        return { 
            level: nextLevel,
            badges: [...user.badges, `master_${user.level}`] // Award mastery badge for previous level
        };
    }
    return {};
};

export const db = {
    login: async (username: string, pass: string): Promise<UserProfile> => {
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        
        if (!user) throw new Error("User ID not found.");
        if (user.password && user.password !== pass) throw new Error("Incorrect password.");
        
        setStorage(DB_CURRENT_USER_ID, user.id);
        const { password, ...profile } = user;
        setTimeout(() => db.checkDailyStreak(), 0);
        return profile;
    },

    register: async (name: string, username: string, pass: string): Promise<UserProfile> => {
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error("User ID taken.");
        }

        const newUser: StoredUser = {
            id: generateId(),
            name,
            username,
            password: pass,
            level: 'N5',
            examDate: '', 
            dailyGoalMinutes: 15,
            streak: 1, 
            lastStudyDate: new Date().toISOString().split('T')[0],
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
            
            if (updates.badges) {
                const oldBadges = new Set(oldUser.badges);
                updates.badges.forEach(b => {
                    if (!oldBadges.has(b)) notifyBadgeUnlock(b);
                });
            }

            users[idx] = newUser;
            setStorage(DB_USERS, users);
            const { password, ...profile } = newUser;
            notifyUserUpdate(profile);
        }
    },

    checkDailyStreak: () => {
        const user = db.getCurrentUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];
        const lastDate = user.lastStudyDate;

        if (lastDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        let updates: Partial<UserProfile> = {};

        if (lastDate === yesterdayStr) {
            newStreak = (user.streak || 0) + 1;
        } else if (lastDate && lastDate < yesterdayStr) {
            newStreak = 1;
        } else if (!lastDate) {
            newStreak = user.streak > 0 ? user.streak : 1;
        }

        updates.streak = newStreak;
        updates.lastStudyDate = today;

        const streakBadges = [`streak_${newStreak}`];
        if (BADGES.some(b => b.id === streakBadges[0]) && !user.badges.includes(streakBadges[0])) {
            updates.badges = [...user.badges, streakBadges[0]];
        }

        db.updateUser(updates);
    },

    addCustomItem: (item: StudyItem) => {
        const custom = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);
        custom.push(item);
        setStorage(DB_CUSTOM_ITEMS, custom);
    },

    getContent: (level: JLPTLevel, type?: 'kanji' | 'vocabulary' | 'grammar'): StudyItem[] => {
        let items = FULL_JLPT_CONTENT.filter(i => i.level === level);
        const custom = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);
        const customFiltered = custom.filter(i => i.level === level);
        items = [...items, ...customFiltered];
        if (type) items = items.filter(i => i.type === type);
        return items;
    },
    
    getReadingMaterials: (level: JLPTLevel) => READING_MATERIALS.filter(r => r.level === level),
    getListeningMaterials: (level: JLPTLevel) => LISTENING_MATERIALS.filter(l => l.level === level),

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
            if (srsData[key] && srsData[key].streak > 0) counts[item.type]++;
        });
        return {
            kanji: totals.kanji === 0 ? 0 : Math.round((counts.kanji / totals.kanji) * 100),
            vocabulary: totals.vocabulary === 0 ? 0 : Math.round((counts.vocabulary / totals.vocabulary) * 100),
            grammar: totals.grammar === 0 ? 0 : Math.round((counts.grammar / totals.grammar) * 100),
        };
    },

    getExamQuestions: (level: JLPTLevel) => MOCK_QUESTIONS,

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
        
        db.checkDailyStreak();

        const user = db.getCurrentUser();
        if(user) {
            let updates: Partial<UserProfile> = {};
            let newBadges = [...user.badges];
            let xpGain = 10;
            if (current.streak > 3) xpGain += 5;
            
            const learnedCount = Object.keys(srsData).filter(k => k.startsWith(userId) && srsData[k].streak > 0).length;
            ['10', '25', '50', '100'].forEach(m => {
                 const bId = `total_kanji_${m}`;
                 if (learnedCount >= parseInt(m) && !user.badges.includes(bId) && BADGES.find(b => b.id === bId)) {
                     newBadges.push(bId);
                     xpGain += 100;
                 }
            });
            
            const hour = new Date().getHours();
            if ((hour >= 22 || hour <= 4) && !user.badges.includes('night_owl')) {
                newBadges.push('night_owl'); xpGain += 50;
            }
            if (hour >= 5 && hour <= 7 && !user.badges.includes('early_bird')) {
                newBadges.push('early_bird'); xpGain += 50;
            }

            const currentTotalXP = user.xp + xpGain;
            updates.xp = currentTotalXP;
            if (newBadges.length > user.badges.length) updates.badges = newBadges;
            
            // Check Promotion
            const promoUpdates = checkLevelUp({ ...user, xp: currentTotalXP });
            if (Object.keys(promoUpdates).length > 0) {
                 updates = { ...updates, ...promoUpdates };
            }

            db.updateUser(updates);
        }
    },

    getDueItems: (level: JLPTLevel, type?: 'kanji' | 'vocabulary' | 'grammar'): StudyItem[] => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return []; 
        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        let allItems = FULL_JLPT_CONTENT.filter(i => i.level === level);
        if (type) allItems = allItems.filter(i => i.type === type);
        const now = Date.now();
        const due = allItems.filter(item => {
            const key = `${userId}:${item.id}`;
            const status = srsData[key];
            if (!status) return false;
            return status.nextReview <= now;
        });
        if (due.length < 10) {
            const newItems = allItems.filter(item => !srsData[`${userId}:${item.id}`]).slice(0, 10 - due.length);
            return [...due, ...newItems];
        }
        return due;
    },

    saveTestResult: (result: Omit<TestResult, 'userId'>) => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return;
        db.checkDailyStreak();
        const results = getStorage<TestResult[]>(DB_RESULTS, []);
        const fullResult: TestResult = { ...result, userId };
        results.push(fullResult);
        setStorage(DB_RESULTS, results);
        
        const user = db.getCurrentUser();
        if (user) {
            let updates: Partial<UserProfile> = {};
            let xpGain = result.score * 10;
            let newBadges = [...user.badges];

            if (result.score === result.total && !user.badges.includes('flawless_victory')) {
                newBadges.push('flawless_victory');
                xpGain += 500;
            }
            
            updates.xp = user.xp + xpGain;
            if (newBadges.length > user.badges.length) updates.badges = newBadges;

            // Check Promotion
            const promoUpdates = checkLevelUp({ ...user, xp: user.xp + xpGain });
            if (Object.keys(promoUpdates).length > 0) {
                 updates = { ...updates, ...promoUpdates };
            }

            db.updateUser(updates);
        }
    },

    getTestHistory: () => {
        const userId = getStorage<string>(DB_CURRENT_USER_ID, '');
        if (!userId) return [];
        return getStorage<TestResult[]>(DB_RESULTS, []).filter(r => r.userId === userId);
    },

    getDebugUsers: () => {
        return getStorage<StoredUser[]>(DB_USERS, []).map(u => ({ username: u.username, name: u.name, avatar: u.avatar, level: u.level, password: u.password }));
    },

    generateTransferCode: (userId: string) => {
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        const userSrs: Record<string, SRSStatus> = {};
        Object.keys(srsData).forEach(key => { if (key.startsWith(`${userId}:`)) userSrs[key] = srsData[key]; });
        const allResults = getStorage<TestResult[]>(DB_RESULTS, []);
        const userResults = allResults.filter(r => r.userId === userId);
        const customItems = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);
        return utf8_to_b64(JSON.stringify({ version: 1, user, srs: userSrs, results: userResults, customItems, timestamp: Date.now() }));
    },

    restoreFromTransferCode: (code: string): UserProfile => {
        const payload = JSON.parse(b64_to_utf8(code));
        const { user, srs, results, customItems } = payload;
        const users = getStorage<StoredUser[]>(DB_USERS, []);
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) users[idx] = { ...users[idx], ...user }; else users.push(user);
        setStorage(DB_USERS, users);
        const srsData = getStorage<Record<string, SRSStatus>>(DB_SRS, {});
        setStorage(DB_SRS, { ...srsData, ...srs });
        const allResults = getStorage<TestResult[]>(DB_RESULTS, []);
        const existingIds = new Set(allResults.map(r => r.id));
        setStorage(DB_RESULTS, [...allResults, ...results.filter((r: TestResult) => !existingIds.has(r.id))]);
        if (customItems) {
            const currentCustom = getStorage<StudyItem[]>(DB_CUSTOM_ITEMS, []);
            const existingC = new Set(currentCustom.map(i => i.id));
            setStorage(DB_CUSTOM_ITEMS, [...currentCustom, ...customItems.filter((i: StudyItem) => !existingC.has(i.id))]);
        }
        setStorage(DB_CURRENT_USER_ID, user.id);
        const { password, ...profile } = user;
        return profile;
    }
};
