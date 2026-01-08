
import React from 'react';

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface UserProfile {
  id: string; // Internal unique identifier
  username: string; // Custom User ID for login
  name: string;
  level: JLPTLevel; // Current Focus Level
  examDate: string;
  dailyGoalMinutes: number;
  streak: number;
  lastStudyDate?: string; // YYYY-MM-DD format
  xp: number;
  badges: string[]; // IDs of earned badges
  isOnboarded: boolean;
  avatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: React.ElementType; // React Component (Lucide Icon)
  color: string; // Tailwind text color class (e.g. 'text-red-500')
  description: string;
  category: string;
}

export interface StudyItem {
  id: string;
  level: JLPTLevel;
  type: 'kanji' | 'vocabulary' | 'grammar';
  lesson?: number; // Added: Lesson number (1-65+)
  lessonTitle?: string; // New: Specific title for the lesson (e.g., "Daily Activities")
  question: string; // The kanji or word
  reading: string; // Hiragana/Katakana or On/Kun readings
  meaning: string;
  example: string;
  exampleTranslation: string;
  audioUrl?: string; // For listening/pronunciation
  tags?: string[];
  strokeCount?: number; // Added for Kanji quizzes
}

// Raw Data Interface for efficient bulk entry
export interface RawKanji {
    kanji: string;
    level: JLPTLevel;
    lesson?: number; // Optional manual override, otherwise calculated
    onyomi: string;
    kunyomi: string;
    meaning: string;
    exampleWord: string;
    exampleReading: string;
    exampleMeaning: string;
    strokeCount?: number; // Added for Kanji quizzes
}

export interface ReadingMaterial {
    id: string;
    level: JLPTLevel;
    title: string;
    content: string; // Japanese Text
    translation: string;
    questions: Question[];
    lesson: number;
}

export interface ListeningMaterial {
    id: string;
    level: JLPTLevel;
    lesson: number;
    title: string;
    description: string;
    duration: string;
    transcript: string; // For display (includes translations)
    audioScript: string; // For playback (Japanese only)
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

export interface Question {
  id: string;
  type: 'grammar' | 'reading' | 'vocabulary' | 'listening' | 'kanji';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}