
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, JLPTLevel } from '../types';
import { sendMessageToSensei, initChat } from '../services/geminiService';
import { Send, Sparkles, HelpCircle } from 'lucide-react';

interface GeminiCoachProps {
  level: JLPTLevel;
}

const SUGGESTIONS = [
    { label: "Explain 'Te-form'", prompt: "Explain how to make and use the Te-form (て形)." },
    { label: "Difference: は vs が", prompt: "What is the difference between particles は (wa) and が (ga)?" },
    { label: "Past Tense", prompt: "How do I conjugate verbs to past tense?" },
    { label: "Counting Objects", prompt: "Explain the Japanese counters (tsu, ko, mai) simply." }
];

const GeminiCoach: React.FC<GeminiCoachProps> = ({ level }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: `Konnichiwa! I am Sakura Sensei 🌸. I'm here to help you pass your JLPT ${level}. Ask me about grammar, kanji, or just practice chatting!`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat(level);
  }, [level]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToSensei(userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-[calc(100vh-140px)] border border-[#E5E0D0]">
      {/* Chat Header */}
      <div className="bg-[#2F3E46] p-4 border-b border-[#2F3E46] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#D74B4B] flex items-center justify-center text-white text-xl border-2 border-[#F9F7E8] shadow-sm">
           🌸
        </div>
        <div>
            <h3 className="font-bold text-white">Sakura Sensei (AI)</h3>
            <p className="text-xs text-[#8E9AAF] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online • {level} Coach
            </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F7E8]">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                ? 'bg-[#D74B4B] text-white rounded-tr-none' 
                : 'bg-white text-[#2C2C2C] border border-[#E5E0D0] rounded-tl-none'
            }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-[#E5E0D0] shadow-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D74B4B] animate-spin" />
                    <span className="text-sm text-[#8E9AAF]">Sensei is thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {!isLoading && messages.length < 4 && (
          <div className="px-4 py-2 bg-[#F9F7E8] border-t border-[#E5E0D0] flex gap-2 overflow-x-auto custom-scrollbar">
              {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s.prompt)}
                    className="whitespace-nowrap px-3 py-1.5 bg-white border border-[#E5E0D0] rounded-full text-xs font-bold text-[#56636A] hover:bg-[#D74B4B] hover:text-white hover:border-[#D74B4B] transition-colors flex items-center gap-1"
                  >
                      <HelpCircle className="w-3 h-3" /> {s.label}
                  </button>
              ))}
          </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#E5E0D0]">
        <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about grammar, vocab, or usage..."
                className="flex-1 px-4 py-3 rounded-xl border border-[#D5D0C0] bg-[#F9F7E8] text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#D74B4B] focus:border-transparent transition-all placeholder:text-[#8E9AAF]"
            />
            <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-[#D74B4B] hover:bg-[#BC002D] text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#D74B4B]/30"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiCoach;
