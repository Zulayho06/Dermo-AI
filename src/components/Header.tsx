import React from 'react';
import { Sparkles, Activity, BookOpen, MessageSquareText, ShieldAlert, History, User } from 'lucide-react';

export type TabType = 'analyzer' | 'atlas' | 'chat' | 'guide' | 'history';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, historyCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Top emergency warning bar */}
      <div className="bg-gradient-to-r from-teal-800 via-cyan-900 to-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full gap-2">
          <div className="flex items-center gap-2 truncate">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <p className="truncate text-slate-200">
              <span className="font-semibold text-amber-300">Tibbiy ogohlantirish:</span> Dastlabki baholash sun&apos;iy intellekt tomonidan amalga oshiriladi. O&apos;tkir infeksiya va qattiq og&apos;riqda shifokorga (103) murojaat qiling.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[11px] text-teal-200 font-medium bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
            <User className="w-3 h-3 text-teal-300" />
            <span>Muallif: <strong className="text-white font-semibold">Qadamova Zulayho</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & App title */}
          <div 
            onClick={() => setActiveTab('analyzer')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  Dermo<span className="text-teal-600">Qo&apos;l</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Tibbiyot
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span className="hidden sm:inline">Qo&apos;l dermatozlari tahlili</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="text-teal-700 font-semibold flex items-center gap-1">
                  <User className="w-3 h-3 text-teal-600" />
                  <span>Muallif: Qadamova Zulayho</span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Tahlil</span>
            </button>

            <button
              onClick={() => setActiveTab('atlas')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'atlas'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Kasalliklar</span> Atlasi
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span className="hidden md:inline">AI Shifokor</span>
              <span className="md:hidden">Suhbat</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Tahlillar tarixi"
            >
              <History className="w-4 h-4" />
              <span className="hidden md:inline">Tarix</span>
              {historyCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'history' ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
