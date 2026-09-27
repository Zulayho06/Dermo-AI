import { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { AnalysisForm } from './components/AnalysisForm';
import { AnalysisResultView } from './components/AnalysisResultView';
import { DiseaseAtlas } from './components/DiseaseAtlas';
import { ConsultChat } from './components/ConsultChat';
import { CareGuide } from './components/CareGuide';
import { ScanHistory } from './components/ScanHistory';
import { HandAnalysisResult, HandSymptoms, DiseaseInfo } from './types/dermatology';
import { ShieldAlert, Activity, HeartHandshake, PhoneCall } from 'lucide-react';

const STORAGE_KEY = 'dermo_qol_scan_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('analyzer');
  const [currentResult, setCurrentResult] = useState<HandAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chatContext, setChatContext] = useState<HandAnalysisResult | null>(null);

  // Local storage scan history
  const [history, setHistory] = useState<HandAnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const handleAnalyze = async (payload: {
    imageBase64?: string;
    imageMimeType?: string;
    symptoms: HandSymptoms;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-hand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server bilan bog‘lanishda xatolik yuz berdi');
      }

      const data: HandAnalysisResult = await response.json();

      // Attach timestamp, image preview and symptoms snapshot
      const enhancedResult: HandAnalysisResult = {
        ...data,
        timestamp: Date.now(),
        userImage: payload.imageBase64,
        symptomsSnapshot: payload.symptoms,
      };

      setCurrentResult(enhancedResult);
      setChatContext(enhancedResult);

      // Prepend to history
      setHistory((prev) => [enhancedResult, ...prev.slice(0, 19)]);

      // Scroll to result smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'Tahlil o‘tkazishda xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnalysis = () => {
    setCurrentResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChatWithContext = (context: HandAnalysisResult) => {
    setChatContext(context);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (result: HandAnalysisResult) => {
    setCurrentResult(result);
    setChatContext(result);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (timestamp: number) => {
    setHistory((prev) => prev.filter((item) => item.timestamp !== timestamp));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Barcha tahlillar tarixini o‘chirib yuborishni xohlaysizmi?')) {
      setHistory([]);
    }
  };

  const handleSelectForCheckup = (_disease: DiseaseInfo) => {
    setCurrentResult(null);
    setActiveTab('analyzer');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Sticky Header with Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Xatolik: </span>
                {errorMessage}
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* View switching */}
        {activeTab === 'analyzer' && (
          <>
            {currentResult ? (
              <AnalysisResultView
                result={currentResult}
                onReset={handleResetAnalysis}
                onOpenChatWithContext={handleOpenChatWithContext}
              />
            ) : (
              <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            )}
          </>
        )}

        {activeTab === 'atlas' && (
          <DiseaseAtlas onSelectForCheckup={handleSelectForCheckup} />
        )}

        {activeTab === 'chat' && <ConsultChat currentContext={chatContext} />}

        {activeTab === 'guide' && <CareGuide />}

        {activeTab === 'history' && (
          <ScanHistory
            history={history}
            onSelectResult={handleSelectFromHistory}
            onDeleteResult={handleDeleteHistoryItem}
            onClearHistory={handleClearAllHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-slate-900">
                  Dermo<span className="text-teal-600">Qo&apos;l</span> AI
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Qo&apos;l terisi salomatligini saqlash, keng tarqalgan dermatozlarni erta aniqlash va ilmiy asoslangan parvarish bo&apos;yicha maslahat beruvchi milliy sun&apos;iy intellekt tizimi.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Bo&apos;limlar
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button onClick={() => setActiveTab('analyzer')} className="hover:text-teal-600">
                    AI Tahlil &amp; Tashxis
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('atlas')} className="hover:text-teal-600">
                    Qo&apos;l Kasalliklari Atlasi
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('chat')} className="hover:text-teal-600">
                    Dermatolog bilan AI Suhbat
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('guide')} className="hover:text-teal-600">
                    Parvarishlash Qo&apos;llanmasi
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Shoshilinch Yordam
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                O&apos;tkir shish, qattiq og&apos;riq yoki yuqori isitmada darhol tibbiy yordamga qo&apos;ng&apos;iroq qiling:
              </p>
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                <PhoneCall className="w-4 h-4" />
                <span>103 (Tez Tibbiy Yordam)</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} DermoQo&apos;l AI. Barcha huquqlar himoyalangan. | <span className="font-semibold text-slate-700">Muallif: Qadamova Zulayho</span>
            </p>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              <span>Sog&apos;lom qo&apos;llar — go&apos;zal hayot garovi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
