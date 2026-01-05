import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { JLPTLevel } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize client
const ai = new GoogleGenAI({ apiKey: API_KEY });

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
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `${SENSEI_PERSONA} The current student is studying for **${level}**. Adjust your complexity accordingly.`,
      temperature: 0.7,
    },
  });
};

export const sendMessageToSensei = async (message: string): Promise<string> => {
  if (!API_KEY) return "Please set your API Key to talk to Sensei! 🌸";
  if (!chatSession) initChat('N5'); // Fallback

  try {
    if(!chatSession) throw new Error("No session");
    const result = await chatSession.sendMessage({ message });
    const response = result as GenerateContentResponse;
    return response.text || "Hmm, I'm thinking... please ask again! 🤔";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sensei is having trouble connecting... verify your internet or API key.";
  }
};

export const generateStudyPlan = async (level: JLPTLevel, daysLeft: number): Promise<string> => {
    if (!API_KEY) return "Set API Key for AI Plans.";
    try {
        const response = await ai.models.generateContent({
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
    if (!API_KEY) return "API Key Required";
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain the Japanese grammar point "${concept}" for JLPT ${level} level. Provide: Usage, Construction, and 2 Examples.`,
    });
    return response.text || "Error explaining.";
}
