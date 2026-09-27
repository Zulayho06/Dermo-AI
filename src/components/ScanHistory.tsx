import React from 'react';
import { 
  History, 
  Trash2, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  FileText
} from 'lucide-react';
import { HandAnalysisResult } from '../types/dermatology';

interface ScanHistoryProps {
  history: HandAnalysisResult[];
  onSelectResult: (result: HandAnalysisResult) => void;
  onDeleteResult: (timestamp: number) => void;
  onClearHistory: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onSelectResult,
  onDeleteResult,
  onClearHistory
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Hozircha tahlillar tarixi mavjud emas
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          &quot;Tahlil&quot; bo‘limida qo‘l fotosuratini yuklab yoki alomatlarni belgilab tahlil o‘tkazing. Barcha natijalar shu yerda avtomatik saqlanib boradi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <span>O‘tkazilgan tahlillar tarixi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jami {history.length} ta tahlil saqlangan
          </p>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Tarixni tozalash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item, index) => {
          const dateStr = item.timestamp
            ? new Date(item.timestamp).toLocaleString('uz-UZ', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : `Tahlil #${index + 1}`;

          const isUrgent = item.urgencyLevel === 'high' || item.urgencyLevel === 'emergency';

          return (
            <div
              key={item.timestamp || index}
              className="bg-white rounded-3xl border border-slate-200 p-5 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dateStr}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isUrgent
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.urgencyLabel?.slice(0, 24) || item.urgencyLevel}
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  {item.userImage ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                      <img
                        src={item.userImage}
                        alt="Qo'l surati"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-900 truncate">
                      {item.primaryCondition?.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 italic truncate">
                      {item.primaryCondition?.latinName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-teal-700 font-semibold">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>{item.primaryCondition?.confidence || 85}% ehtimollik</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {item.primaryCondition?.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => item.timestamp && onDeleteResult(item.timestamp)}
                  className="text-xs text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                  title="Ushbu yozuvni o'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectResult(item)}
                  className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Batafsil ko‘rish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
