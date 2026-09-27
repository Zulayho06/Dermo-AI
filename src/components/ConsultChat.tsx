import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShieldAlert, 
  Trash2,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { ChatMessage, HandAnalysisResult } from '../types/dermatology';

interface ConsultChatProps {
  currentContext?: HandAnalysisResult | null;
}

const STARTER_PROMPTS = [
  "Qishda qo‘lim juda yorilib, qonayapti. Qanday parvarishlash kerak?",
  "Idish yuvish vositasidan keyin qichishish va toshma toshdi, nima qilay?",
  "Barmoqlar orasidagi qichuvchi pufakchalarni yorish xavflimi?",
  "Tirnoq chetidagi qizarish va yiringlashda birinchi yordam qanday?",
  "Qo‘l terisi uchun emolyent kremni qanday to‘g‘ri tanlash kerak?"
];

export const ConsultChat: React.FC<ConsultChatProps> = ({ currentContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialText = currentContext
      ? `Assalomu alaykum! Men qo‘l dermatologiyasi bo‘yicha AI shifokor-maslahatchiman. Siz hozirgina "${currentContext.primaryCondition?.name}" bo‘yicha tahlil o‘tkazdingiz. Ushbu holat, dorilar guruhi, kundalik parvarish yoki qo‘shimcha alomatlar bo‘yicha har qanday savolingizga javob berishga tayyorman.`
      : `Assalomu alaykum! Men qo‘l terisi salomatligi va dermatologiya bo‘yicha AI maslahatchiman. Qo‘lingizdagi toshmalar, qichishish, yoriqlar, kremlar tanlash va to‘g‘ri parvarish bo‘yicha xohlagan savolingizni berishingiz mumkin.`;

    return [
      {
        id: 'msg-init',
        role: 'model',
        content: initialText,
        timestamp: Date.now()
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/consult-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          currentContext: currentContext || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Server xatosi yuz berdi');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'model',
        content: data.reply || "Kechirasiz, javob olishda uzilish bo'ldi. Qaytadan urinib ko'ring.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'model',
        content: "Tarmoq bilan bog‘lanishda xatolik yuz berdi. Iltimos, internetingizni tekshirib, savolingizni qayta yuboring.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        role: 'model',
        content: "Suhbat tozalandi. Qo‘l terisi bo‘yicha yangi savolingizni berishingiz mumkin.",
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-teal-900 to-cyan-950 p-4 sm:p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base">Dermatolog AI Maslahatchi</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-300">
              Qo‘l terisi kasalliklari va parvarish bo‘yicha onlayn yordamchi
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1.5"
          title="Suhbatni tozalash"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Tozalash</span>
        </button>
      </div>

      {/* Context banner if loaded */}
      {currentContext && (
        <div className="bg-teal-50/80 border-b border-teal-200 px-4 py-2.5 text-xs text-teal-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">
              Faol tahlil: <span className="font-bold">{currentContext.primaryCondition?.name}</span> ({currentContext.primaryCondition?.latinName})
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold shrink-0">
            Kontekst faol
          </span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-teal-600 text-white'
                    : 'bg-gradient-to-br from-cyan-700 to-teal-800 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
              <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <span>Dermatolog javob tayyorlamoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick starter chips */}
      <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
          Savollar:
        </span>
        {STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-medium whitespace-nowrap transition-colors shrink-0 border border-slate-200/80"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Qo‘l terisi kasalliklari yoki dori/krem haqida so‘rang..."
            disabled={isLoading}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-2xl font-bold shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>Axborot xarakteridagi konsultatsiya. Shifokor retsepti o‘rnini bosa olmaydi.</span>
        </div>
      </div>
    </div>
  );
};
