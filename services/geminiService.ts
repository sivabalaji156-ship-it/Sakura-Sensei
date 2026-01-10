
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { JLPTLevel } from "../types";

// Robust API Key Retrieval
const getApiKey = () => {
    let key = '';
    try {
        // 1. Check process.env (Standard Node/Webpack/Parcel)
        if (typeof process !== 'undefined' && process?.env?.API_KEY) {
            key = process.env.API_KEY;
        }
    } catch (e) { }

    if (!key) {
        try {
            // 2. Check import.meta.env (Vite Standard fallback)
            // @ts-ignore
            if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
                // @ts-ignore
                key = import.meta.env.VITE_API_KEY;
            }
        } catch (e) { }
    }
    
    // Clean up key: remove whitespace and accidental quotes
    if (key) {
        key = key.trim().replace(/^["']|["']$/g, '');
    }
    
    return key;
};

const API_KEY = getApiKey();

// Initialize client lazy-ly
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai && API_KEY) {
        try {
            ai = new GoogleGenAI({ apiKey: API_KEY });
        } catch (e) {
            console.error("Failed to init GoogleGenAI", e);
        }
    }
    return ai;
};

const SENSEI_PERSONA = `
You are "Sakura Sensei", a dedicated, warm, and highly knowledgeable JLPT tutor.
Your mission: Guide the student to pass their JLPT exam.

Attributes:
- **Tone**: Encouraging, polite (Desu/Masu), mostly English but uses simple Japanese phrases (Ganbatte, Sugoi!).
- **Style**: Anime-inspired "Sensei" character. Use emojis like 🌸, ✨, 🎌.
- **Method**: 
  - **Grammar Explanations**: When asked about grammar (e.g., "explain て-form", "what implies...", "how to use..."), provide:
    1. **Structure**: How it connects.
    2. **Meaning**: The nuance.
    3. **Examples**: 2-3 simple sentences with translation.
  - When correcting, be gentle but precise.
  - If asked about a word, give the Kanji, Hiragana, and Context.

Constraints:
- Keep responses concise (under 150 words usually) unless asked for a detailed explanation.
- Always tailor difficulty to the user's JLPT level.
`;

let chatSession: Chat | null = null;
let currentLevel: JLPTLevel = 'N5';

export const initChat = (level: JLPTLevel) => {
    const client = getAiClient();
    if (!client) return;
    
    // Only re-initialize if level changes or session is missing
    if (chatSession && currentLevel === level) return;

    try {
        currentLevel = level;
        chatSession = client.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `${SENSEI_PERSONA} The current student is studying for **${level}**. Adjust your complexity accordingly.`,
                temperature: 0.7,
            },
        });
    } catch (e) {
        console.warn("Chat init failed", e);
    }
};

export const sendMessageToSensei = async (message: string): Promise<string> => {
  if (!API_KEY) {
      console.warn("SakuraSensei: Missing API Key");
      return "I can't connect to my brain right now! Please check if your API Key is set in the environment variables (process.env.API_KEY). 🌸";
  }
  
  const client = getAiClient();
  if (!client) return "Sensei initialization failed (Client Error).";

  if (!chatSession) initChat(currentLevel);

  try {
    if(!chatSession) {
        // Retry init
        initChat(currentLevel);
        if (!chatSession) return "Sensei is offline right now (Check connection).";
    }
    
    if (chatSession) {
        // Send message using the correct object structure for 0.3.0
        const response: GenerateContentResponse = await chatSession.sendMessage({ message });
        
        // Access text via getter
        return response.text || "Hmm, I'm thinking... please ask again! 🤔";
    }
    return "Sensei connection error.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Friendly error parsing
    let errorMessage = "Sensei is having trouble connecting...";
    if (error.message?.includes('400') || error.message?.includes('API key')) {
        errorMessage = "My API Key seems to be invalid. Please check your configuration. 🌸";
    } else if (error.message?.includes('429')) {
        errorMessage = "I'm a bit overwhelmed! Let's take a short break (Rate Limit). 🍵";
    } else {
        errorMessage += ` (Error: ${error.message})`;
    }
    
    return errorMessage;
  }
};

export const generateStudyPlan = async (level: JLPTLevel, daysLeft: number): Promise<string> => {
    const client = getAiClient();
    if (!client) return "Set API Key for AI Plans. (Simulated Plan: Study Genki I Ch. 1)";
    
    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a **one-day study plan** (markdown) for a student taking JLPT ${level} in ${daysLeft} days. 
            Include:
            1. **Theme of the Day** (e.g., Particles, Transit Kanji)
            2. **3 Key Tasks** (Vocab, Grammar, Practice) with estimated times.
            3. **Motivation Quote** in Japanese + English.
            Keep it strictly formatted.`,
        });
        return response.text || "Plan generation failed.";
    } catch (e) {
        return "Could not contact the planning server.";
    }
}

export const explainGrammar = async (concept: string, level: JLPTLevel): Promise<string> => {
    const client = getAiClient();
    if (!client) return "Please set your API Key to ask Sensei! 🌸 (Simulated Explanation: This is a grammar point.)";
    
    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: SENSEI_PERSONA
            },
            contents: `Explain the Japanese grammar point "${concept}" for a JLPT ${level} student. 
            Include:
            1. Structure (Connection)
            2. Meaning/Nuance
            3. Two simple Example Sentences with translations.
            Keep it structured, concise and encouraging.`,
        });
        return response.text || "Sensei couldn't find that in the scroll... try again?";
    } catch (e) {
        console.error(e);
        return "Sensei is having connection trouble... check your API Key.";
    }
}
