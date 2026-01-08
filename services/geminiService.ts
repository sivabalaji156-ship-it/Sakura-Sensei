
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { JLPTLevel } from "../types";

// Safe access to env with extra fallback
const getApiKey = () => {
    try {
        // Double check process existence before accessing properties
        // In some bundlers process is not polyfilled, so we check typeof process first
        if (typeof process !== 'undefined' && process && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {
        // Silently fail if process is not defined (browser env)
    }
    return '';
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
  - When explaining grammar, break it down: Structure -> Meaning -> Example.
  - When correcting, be gentle but precise.
  - If asked about a word, give the Kanji, Hiragana, and Context.

Constraints:
- Keep responses concise (under 150 words usually) unless asked for a detailed explanation.
- Always tailor difficulty to the user's JLPT level.
`;

let chatSession: Chat | null = null;

export const initChat = (level: JLPTLevel) => {
    const client = getAiClient();
    if (!client) return;
    
    try {
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
  if (!API_KEY) return "Please set your API Key to talk to Sensei! 🌸 (Simulated Mode)";
  
  if (!chatSession) initChat('N5'); // Fallback

  try {
    if(!chatSession) {
        // Double check after retry
        initChat('N5');
        if (!chatSession) return "Sensei is offline right now (Check connection).";
    }
    
    // Non-null assertion safe because of check above, but TS might complain so we check again
    if (chatSession) {
        const result = await chatSession.sendMessage({ message });
        const response = result as GenerateContentResponse;
        return response.text || "Hmm, I'm thinking... please ask again! 🤔";
    }
    return "Sensei connection error.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sensei is having trouble connecting... verify your internet or API key.";
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