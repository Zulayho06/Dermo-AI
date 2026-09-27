import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Printer, 
  RotateCcw, 
  MessageSquareText, 
  HeartHandshake, 
  Stethoscope, 
  HelpCircle,
  Clock,
  Sparkle
} from 'lucide-react';
import { HandAnalysisResult, UrgencyLevel } from '../types/dermatology';

interface AnalysisResultViewProps {
  result: HandAnalysisResult;
  onReset: () => void;
  onOpenChatWithContext: (context: HandAnalysisResult) => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  onReset,
  onOpenChatWithContext
}) => {
  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case 'emergency':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-800',
          dot: 'bg-rose-600',
          title: 'Shoshilinch tibbiy ko‘rik zarur',
          desc: 'Infeksiya tarqalishi yoki asorat xavfi yuqori. Darhol shifokorga boring.'
        };
      case 'high':
        return {
          bg: 'bg-orange-50 border-orange-300 text-orange-800',
          dot: 'bg-orange-500',
          title: 'Dermatolog ko‘rigi tavsiya etiladi',
          desc: 'Holat professional davolash va retsept asosidagi dori vositalarini talab qilishi mumkin.'
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-800',
          dot: 'bg-amber-500',
          title: 'O‘rtacha darajadagi holat',
          desc: 'Ehtiyotkorona parvarish va profilaktika zarur. Agar yaxshilanmasa, shifokorga murojaat qiling.'
        };
      case 'mild':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
          dot: 'bg-emerald-500',
          title: 'Yengil / Uy sharoitida parvarishlash mumkin',
          desc: 'To‘g‘ri gigiyena va namlantiruvchi vositalar bilan holatni sezilarli yaxshilash mumkin.'
        };
    }
  };

  const urgency = getUrgencyBadge(result.urgencyLevel);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn print:space-y-4 print:text-black">
      {/* Print only official header */}
      <div className="hidden print:block border-b-2 border-teal-800 pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">DermoQo‘l AI — Tibbiy Dermatologik Tahlil Xulosasi</h1>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            {new Date(result.timestamp || Date.now()).toLocaleString('uz-UZ')}
          </div>
        </div>
      </div>

      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yangi tahlil</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenChatWithContext(result)}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl border border-teal-200 transition-all"
          >
            <MessageSquareText className="w-4 h-4 text-teal-600" />
            <span>AI Maslahatchi</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
            title="Hisobotni chop etish yoki PDF sifatida saqlash"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Chop etish / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Diagnosis Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Urgency indicator header */}
        <div className={`p-4 rounded-2xl border ${urgency.bg} mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full ${urgency.dot} animate-pulse shrink-0`} />
            <div>
              <div className="font-bold text-sm tracking-tight">{urgency.title}</div>
              <div className="text-xs opacity-90">{urgency.desc}</div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/70 backdrop-blur-sm self-start sm:self-auto uppercase tracking-wider font-bold">
            Daraja: {result.urgencyLevel}
          </span>
        </div>

        {/* Primary Diagnosis & Confidence */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>ASOSIY EHTIMOLIY TASHXIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {result.primaryCondition?.name}
            </h2>
            <p className="text-sm font-mono text-slate-500 italic mt-0.5">
              {result.primaryCondition?.latinName}
            </p>
          </div>

          {/* Confidence Gauge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Ishonchlilik ehtimoli</div>
              <div className="text-2xl font-black text-slate-900">
                {result.primaryCondition?.confidence || 85}%
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-sm border-2 border-teal-500">
              AI Match
            </div>
          </div>
        </div>

        {/* Short description */}
        <div className="py-5 text-slate-700 text-sm sm:text-base leading-relaxed">
          {result.primaryCondition?.shortDescription}
        </div>

        {/* Attached photo & symptoms snapshot if present */}
        {(result.userImage || result.symptomsSnapshot) && (
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {result.userImage && (
              <div className="sm:col-span-1 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-40 flex items-center justify-center">
                <img
                  src={result.userImage}
                  alt="Tahlil qilingan surat"
                  className="max-h-40 w-auto object-contain"
                />
              </div>
            )}
            <div className={`${result.userImage ? 'sm:col-span-2' : 'sm:col-span-3'} text-xs space-y-1 text-slate-600`}>
              <div className="font-semibold text-slate-800 mb-1">Kiritilgan ko‘rsatkichlar:</div>
              <div><span className="font-medium text-slate-700">Joylashuvi:</span> {result.symptomsSnapshot?.location}</div>
              <div><span className="font-medium text-slate-700">Davomiyligi:</span> {result.symptomsSnapshot?.duration}</div>
              <div><span className="font-medium text-slate-700">Qichishish / Og‘riq:</span> {result.symptomsSnapshot?.itchLevel} | {result.symptomsSnapshot?.painLevel}</div>
              {result.symptomsSnapshot?.triggers?.length ? (
                <div><span className="font-medium text-slate-700">Aloqa:</span> {result.symptomsSnapshot.triggers.join(', ')}</div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Differential diagnoses */}
      {result.differentialDiagnoses && result.differentialDiagnoses.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <span>Differensial tashxislar (Muqobil variantlar)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.differentialDiagnoses.map((diff, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-slate-900">{diff.name}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {diff.probability}% ehtimol
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 italic mb-2">
                  {diff.latinName}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {diff.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Care recommendations: Do's and Don'ts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DO's */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span>Tavsiya etiladigan amallar (Qilish kerak)</span>
          </div>

          <ul className="space-y-3">
            {result.careRecommendations?.do?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DONT's */}
        <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-rose-800 font-bold text-base mb-4">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
            <span>Qat’iyan taqiqlanadigan harakatlar (Mumkin emas)</span>
          </div>

          <ul className="space-y-3">
            {result.careRecommendations?.dont?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  ✕
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skincare Routine & Recommended Ingredients */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
          <HeartHandshake className="w-5 h-5 text-teal-600" />
          <span>Kundalik parvarish tartibi va faol moddalar</span>
        </div>

        {result.careRecommendations?.skincareRoutine && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Bosqichma-bosqich reja:</span>
            </div>
            {result.careRecommendations.skincareRoutine}
          </div>
        )}

        {result.careRecommendations?.recommendedIngredients && (
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
              Foydali bo‘lgan komponentlar (Krem xarid qilishda e’tibor bering):
            </div>
            <div className="flex flex-wrap gap-2">
              {result.careRecommendations.recommendedIngredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-teal-50 text-teal-900 border border-teal-200 rounded-xl text-xs font-medium flex items-center gap-1.5"
                >
                  <Sparkle className="w-3 h-3 text-teal-600" />
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Warning signs: When to visit doctor urgently */}
      {result.warningSigns && result.warningSigns.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Qachon zudlik bilan shifokorga borish shart? (Xavfli belgilar)</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-amber-950">
            {result.warningSigns.map((sign, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-amber-700">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions for the Doctor */}
      {result.doctorQuestions && result.doctorQuestions.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-3">
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <span>Shifokor qabulida so‘rashingiz mumkin bo‘lgan savollar:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.doctorQuestions.map((q, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <span className="font-semibold text-teal-700 mr-1.5">#{idx + 1}</span>
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-slate-600 text-xs flex items-start gap-3 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p>{result.disclaimer}</p>
      </div>

      {/* Bottom Floating/Fixed Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-teal-900 to-cyan-900 text-white rounded-3xl p-6 print:hidden">
        <div>
          <h4 className="font-bold text-lg">Savollaringiz bormi?</h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Ushbu tahlil natijalarini to‘g‘ridan-to‘g‘ri AI shifokor bilan muhokama qiling.
          </p>
        </div>
        <button
          onClick={() => onOpenChatWithContext(result)}
          className="w-full sm:w-auto px-6 py-3.5 bg-white text-teal-900 hover:bg-teal-50 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <MessageSquareText className="w-4 h-4 text-teal-700" />
          <span>AI Shifokor bilan suhbatni boshlash</span>
        </button>
      </div>
    </div>
  );
};
