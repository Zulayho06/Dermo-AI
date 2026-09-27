import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  X, 
  Sparkles, 
  HelpCircle, 
  CheckSquare, 
  Square, 
  Flame, 
  Clock, 
  AlertCircle,
  FileCheck2,
  User
} from 'lucide-react';
import { HandSymptoms } from '../types/dermatology';
import { HandZoneSelector } from './HandZoneSelector';
import { SAMPLE_CASES, SampleCase } from '../data/sampleCases';

interface AnalysisFormProps {
  onAnalyze: (payload: {
    imageBase64?: string;
    imageMimeType?: string;
    symptoms: HandSymptoms;
  }) => void;
  isLoading: boolean;
}

const DURATION_OPTIONS = [
  '1-3 kun (O‘tkir boshlanish)',
  '1-2 hafta',
  '1 oydan ko‘p (Cho‘zilgan)',
  'Yillardan beri davriy qaytalanuvchi (Surunkali)'
];

const ITCH_OPTIONS = [
  { value: "Yo'q", label: "Qichishish yo‘q" },
  { value: "Yengil qichishish", label: "Yengil / vaqti-vaqti bilan" },
  { value: "Kuchli / Tunda bezovta qiladi", label: "Kuchli / Tunda uyqu bermaydi" }
];

const PAIN_OPTIONS = [
  { value: "Og'riq yo'q", label: "Og‘riq sezilmaydi" },
  { value: "Achishish yoki sanchish", label: "Achishish, kuygandek sanchish" },
  { value: "Kuchli og'riq / shish", label: "Kuchli og‘riq, puls urishi, shish" }
];

const VISUAL_SYMPTOMS = [
  'Qizarish (Eritema)',
  'Mayda suvli pufakchalar (Vezikulalar)',
  'Qipiqlanish / po‘st tashlash',
  'Chuqur yoriqlar / qonash',
  'Terining haddan tashqari quruqligi va tarangligi',
  'Yiringli nuqta yoki shish',
  'Tirnoqning sarg‘ayishi yoki qalinlashishi',
  'Qalinlashgan qattiq tugunchalar (so‘gal)'
];

const COMMON_TRIGGERS = [
  'Kir yuvish va idish yuvish vositalari',
  'Kimyoviy moddalar, xlor, bo‘yoqlar',
  'Sovuq qishki havo va shamol',
  'Spirtli antiseptiklar',
  'Kuchli stress yoki asabiylashish',
  'Kutikula jarohati / manikyur',
  'Suvda uzoq vaqt qo‘l ivishi',
  'Hayvonlar (mushuk, it) bilan aloqa'
];

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [selectedZone, setSelectedZone] = useState<string>('Barmoqlar yon yuzasi va orasi');
  const [duration, setDuration] = useState<string>(DURATION_OPTIONS[0]);
  const [itchLevel, setItchLevel] = useState<string>(ITCH_OPTIONS[1].value);
  const [painLevel, setPainLevel] = useState<string>(PAIN_OPTIONS[0].value);
  const [selectedVisuals, setSelectedVisuals] = useState<string[]>([
    'Qizarish (Eritema)',
    'Mayda suvli pufakchalar (Vezikulalar)'
  ]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([
    'Kir yuvish va idish yuvish vositalari'
  ]);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Iltimos, faqat rasm faylini tanlang (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setImageBase64(compressed);
          setImageMimeType('image/jpeg');
        } else {
          setImageBase64(rawDataUrl);
          setImageMimeType(file.type || 'image/jpeg');
        }
      };
      img.onerror = () => {
        setImageBase64(rawDataUrl);
        setImageMimeType(file.type || 'image/jpeg');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const toggleVisual = (item: string) => {
    setSelectedVisuals(prev =>
      prev.includes(item) ? prev.filter(v => v !== item) : [...prev, item]
    );
  };

  const toggleTrigger = (item: string) => {
    setSelectedTriggers(prev =>
      prev.includes(item) ? prev.filter(t => t !== item) : [...prev, item]
    );
  };

  const handleSelectSample = (sample: SampleCase) => {
    setImageBase64(sample.imageUrl);
    setImageMimeType('image/jpeg');
    setSelectedZone(sample.symptoms.location);
    setDuration(sample.symptoms.duration);
    setItchLevel(sample.symptoms.itchLevel);
    setPainLevel(sample.symptoms.painLevel);
    setSelectedVisuals(sample.symptoms.visualFeatures);
    setSelectedTriggers(sample.symptoms.triggers);
    setAdditionalNotes(sample.symptoms.additionalNotes);

    // Scroll smoothly to form top
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const symptoms: HandSymptoms = {
      location: selectedZone,
      duration,
      itchLevel,
      painLevel,
      triggers: selectedTriggers,
      visualFeatures: selectedVisuals,
      additionalNotes
    };

    onAnalyze({
      imageBase64: imageBase64 || undefined,
      imageMimeType,
      symptoms
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero introduction */}
      <div className="bg-gradient-to-br from-teal-900 via-cyan-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Dermatologik Tashxis Tizimi</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20">
              <User className="w-3.5 h-3.5 text-teal-300" />
              <span>Loyiha muallifi: <strong className="font-bold text-teal-200">Qadamova Zulayho</strong></span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Qo‘lingizdagi toshma va o‘zgarishlarni aniqlang
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Qo‘l terisi fotosuratini yuklang va alomatlarni belgilang. Bizning sun’iy intellekt modeli ekzema, psoriaz, zamburug‘, kontakt dermatit yoki boshqa kasalliklarni tahlil qilib, professional parvarish tavsiyalarini taqdim etadi.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              <span>Tezkor vizual tahlil</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              <span>Sabab va xavf darajasi</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              <span>Shifokor tavsiyalari</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset sample test cases */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-teal-600" />
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              Yoki sinov uchun tayyor klinik holatni tanlang (1-bosing):
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Tezkor sinov namunalari
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-left bg-white border border-slate-200 hover:border-teal-400 rounded-xl p-3 hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sample.badgeColor}`}>
                  {sample.tag}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 group-hover:text-teal-700">
                {sample.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {sample.description}
              </p>
              <div className="mt-2 text-[10px] font-semibold text-teal-600 flex items-center gap-1">
                Yuklash va to‘ldirish &rarr;
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Photo upload */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-600" />
              <span>Qo‘l terisi fotosurati (Tavsiya etiladi)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Qo‘lingizdagi zararlangan sohani yaqindan, tiniq yorug‘likda oling yoki galereyadan tanlang.
            </p>
          </div>
          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            JPG, PNG, WEBP
          </span>
        </div>

        {imageBase64 ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex flex-col items-center justify-center p-3">
            <img
              src={imageBase64}
              alt="Qo'l terisi fotosurati"
              className="max-h-80 w-auto rounded-lg object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                type="button"
                onClick={() => setImageBase64(null)}
                className="bg-black/70 hover:bg-black text-white p-2 rounded-xl backdrop-blur-md transition-colors"
                title="Rasmni o'chirish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 text-center text-xs text-slate-300">
              Surat biriktirildi. Tahlil uchun tayyor.
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all ${
              isDragOver
                ? 'border-teal-500 bg-teal-50/50'
                : 'border-slate-300 hover:border-teal-400 bg-slate-50/50'
            }`}
          >
            <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Qo‘l fotosuratini shu yerga sudrab tashlang
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tiniq, yaxshi yoritilgan va barmoq/kaft to‘liq ko‘ringan surat eng aniq natijani beradi.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                Fayllardan tanlash
              </button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-teal-600" />
                <span>Kamera orqali rasmga olish</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Anatomical Hand Zone */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
        <HandZoneSelector
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        />
      </div>

      {/* Step 3: Symptoms details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          2. Alomatlar va kechishi
        </h3>

        {/* Duration selector */}
        <div>
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Kasallik qachondan beri bezovta qilmoqda?</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {DURATION_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDuration(item)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                  duration === item
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-1 ring-teal-500'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Itch & Pain levels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Itch Level */}
          <div>
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Qichishish darajasi</span>
            </label>
            <div className="space-y-2">
              {ITCH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setItchLevel(opt.value)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    itchLevel === opt.value
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold ring-1 ring-amber-400'
                      : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  {itchLevel === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Og‘riq yoki achishish</span>
            </label>
            <div className="space-y-2">
              {PAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPainLevel(opt.value)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    painLevel === opt.value
                      ? 'border-rose-500 bg-rose-50 text-rose-950 font-semibold ring-1 ring-rose-400'
                      : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  {painLevel === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual characteristics */}
        <div className="pt-2">
          <label className="text-sm font-semibold text-slate-800 block mb-2">
            Toshma va o‘zgarishlarning tashqi ko‘rinishi (Bir nechtasini tanlang):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VISUAL_SYMPTOMS.map((sign) => {
              const checked = selectedVisuals.includes(sign);
              return (
                <button
                  key={sign}
                  type="button"
                  onClick={() => toggleVisual(sign)}
                  className={`p-2.5 rounded-xl border text-left text-xs sm:text-sm flex items-center gap-2.5 transition-all ${
                    checked
                      ? 'border-teal-600 bg-teal-50/80 text-teal-900 font-semibold'
                      : 'border-slate-200 bg-slate-50/30 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{sign}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Triggers */}
        <div className="pt-2">
          <label className="text-sm font-semibold text-slate-800 block mb-2">
            Toshma paydo bo‘lishidan oldin nimalar bilan aloqa bo‘lgan? (Provokatorlar):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_TRIGGERS.map((trigger) => {
              const checked = selectedTriggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  type="button"
                  onClick={() => toggleTrigger(trigger)}
                  className={`p-2.5 rounded-xl border text-left text-xs sm:text-sm flex items-center gap-2.5 transition-all ${
                    checked
                      ? 'border-teal-600 bg-teal-50/80 text-teal-900 font-semibold'
                      : 'border-slate-200 bg-slate-50/30 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{trigger}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional notes */}
        <div className="pt-2">
          <label className="text-sm font-semibold text-slate-800 flex items-center justify-between mb-1.5">
            <span>Bemorning qo‘shimcha izohi (Ixtiyoriy)</span>
            <span className="text-xs text-slate-400 font-normal">Avval ishlatilgan kremlar yoki boshqa belgilar</span>
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={2}
            placeholder="Masalan: 'Oddiy namlantiruvchi krem surtganimda qattiq achishyapti, idish yuvganda ko'payadi...'"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 rounded-2xl p-5 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Tahlil natijasida ehtimoliy tashxis, foizli ishonchlilik, kundalik parvarish qoidalari va shifokorga murojaat qilish bo‘yicha to‘liq tavsiyalar olasiz.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0 text-sm sm:text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>AI Tahlil qilmoqda...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Qo‘l Terisini AI Bilan Tahlil Qilish</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
