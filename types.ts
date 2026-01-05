
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface UserProfile {
  id: string; // Internal unique identifier
  username: string; // Custom User ID for login
  name: string;
  level: JLPTLevel; // Current Focus Level
  examDate: string;
  dailyGoalMinutes: number;
  streak: number;
  xp: number;
  badges: string[]; // IDs of earned badges
  isOnboarded: boolean;
  avatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
}

export interface StudyItem {
  id: string;
  level: JLPTLevel;
  type: 'kanji' | 'vocabulary' | 'grammar';
  question: string; // The kanji or word
  reading: string; // Hiragana/Katakana
  meaning: string;
  example: string;
  exampleTranslation: string;
  audioUrl?: string; // For listening/pronunciation
  tags?: string[];
}

export interface ReadingMaterial {
    id: string;
    level: JLPTLevel;
    title: string;
    content: string; // Japanese Text
    translation: string;
    questions: Question[];
}

export interface SRSStatus {
  itemId: string;
  nextReview: number; // Timestamp
  interval: number; // Days
  easeFactor: number;
  streak: number;
}

export interface TestResult {
  id: string;
  userId: string; // Linked to specific user
  date: number;
  score: number;
  total: number;
  type: 'mock' | 'mini';
  level: JLPTLevel;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface FlashcardData {
  id: string;
  front: string;
  reading: string;
  meaning: string;
  exampleSentence: string;
  exampleTranslation: string;
  level: JLPTLevel;
  type: 'kanji' | 'vocabulary' | 'grammar';
  mastery: number;
}

export interface Question {
  id: string;
  type: 'grammar' | 'reading' | 'vocabulary' | 'listening' | 'kanji';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}