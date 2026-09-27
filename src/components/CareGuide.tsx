import React from 'react';
import { 
  HeartHandshake, 
  Droplets, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Sun, 
  AlertCircle,
  Sparkles,
  Layers,
  Sparkle
} from 'lucide-react';

export const CareGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Professional Dermatologik Gid</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Qo‘l Terisini To‘g‘ri Parvarishlash Qoidalari
        </h2>
        <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
          Qo‘l terisi tanamizdagi eng yupqa va tashqi ta’sirlarga (suv, sovun, kimyoviy moddalar, sovuq) eng ko‘p uchraydigan a’zolardan biridir. Quyidagi qoidalarga rioya qilish 90% dermatozlarning oldini oladi.
        </p>
      </div>

      {/* 1. Washing & Drying Rules */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <h3>1. Qo‘lni to‘g‘ri yuvish va quritish odatlari</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-teal-800 flex items-center gap-1.5">
              <span>✓ Suv harorati:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Hech qachon qaynoq suvda yuvmang. Qaynoq suv terining himoya yog‘ qatlamini (lipid mantiyasini) eritib yuboradi. Har doim iliq yoki xona haroratidagi suvdan foydalaning.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-teal-800 flex items-center gap-1.5">
              <span>✓ Sovun tanlash:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Oddiy ishqorli qattiq sovunlar o‘rniga pH 5.5 bo‘lgan sindet-gellar, krem-sovunlar yoki gidrofil moylardan foydalaning. Spirtli antiseptiklarni faqat suv bo‘lmagandagina qo‘llang.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-teal-800 flex items-center gap-1.5">
              <span>✓ Quritish qoidasi:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Qo‘lni sochiq bilan qattiq ishqalamang! Yumshoq paxta sochiq yoki qog‘oz salfetka bilan muloyimlik bilan bosib-bosib quriting.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5">
            <div className="font-bold text-teal-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Oltin &quot;3 daqiqa&quot; qoidasi:</span>
            </div>
            <p className="text-teal-950 leading-relaxed">
              Qo‘l yuvilgandan keyin teri hali bir oz nam bo‘lgan dastlabki 3 daqiqa ichida krem surtilsa, namlik terining ichki qavatlarida qulflanadi.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Understanding Creams: Emollients vs Occlusives */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3>2. Krem tanlash san’ati: Qaysi vosita nima uchun kerak?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">1-guruh</span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">Gümektantlar (Namlovchilar)</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Atrofdan va terining chuqur qavatlaridan suv molekulalarini tortib beradi.
              </p>
              <div className="mt-3 text-xs text-slate-700">
                <span className="font-semibold text-slate-800">Tarkibida:</span> Glitserin, Gialuron kislotasi, Mochevina (Urea 5-10%), Pantenol.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">2-guruh</span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">Emolyentlar (Yumshatuvchilar)</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Hujayralar orasidagi bo‘shliqni lipidlar bilan to‘ldiradi, terini silliq qiladi va elastiklik beradi.
              </p>
              <div className="mt-3 text-xs text-slate-700">
                <span className="font-semibold text-slate-800">Tarkibida:</span> Tseramidlar (Ceramides), Skvalan, Xolesterin, Yog‘ kislotalari.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">3-guruh</span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">Okkluzivlar (Himoya qalqoni)</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Teri ustida himoya pardasi hosil qilib, namlikning havoga bug‘lanishiga yo‘l qo‘ymaydi.
              </p>
              <div className="mt-3 text-xs text-slate-700">
                <span className="font-semibold text-slate-800">Tarkibida:</span> Shi moyi (Karite), Vazelin, Asalari mumi, Dimetikon.
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Eslatma:</span> Qattiq yorilgan va qonayotgan teriga spirtli, kuchli xushbo‘y hidli (parfyum) va rangli kremlarni surtmang. Faqat dorixonadagi hipoallergen emolyentlardan foydalaning.
          </p>
        </div>
      </div>

      {/* 3. Protection during household work */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3>3. Tozalash va uy ishlarida qo‘lqop kiyish qoidalari</h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </span>
            <p>
              Idish yuvish gellari, kukunlar va pol yuvish vositalari tarkibida kuchli PAW (sirt faol moddalar) va xlor bo‘ladi. Ular bilan doimo <span className="font-semibold text-slate-900">himoya qo‘lqoplarida</span> ishlang.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </span>
            <p>
              <span className="font-semibold text-slate-900">&quot;Ikki qavat&quot; usuli:</span> Rezina yoki lateks qo‘lqop ichida qo‘l terlashi mumkin (bu ekzemani qo‘zg‘atadi). Shuning uchun ichidan avval ingichka paxta qo‘lqop kiyib, ustidan rezina qo‘lqop kiyish eng xavfsiz dermatologik usuldir.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </span>
            <p>
              Qo‘lqopni bir marta uzluksiz 20-30 daqiqadan ortiq taqmang. Ish tugagach, qo‘lingizni yuvib, darhol emolyent surting.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Seasonal Hand Care */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Winter */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-blue-900 font-bold text-base">
            <ThermometerSnowflake className="w-5 h-5 text-blue-600" />
            <span>Qishki sovuq va shamolda</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Ko‘chaga chiqishdan 20 daqiqa oldin yog‘li &quot;Cold cream&quot; surting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Har doim issiq va shamol o‘tkazmaydigan qo‘lqop kiying.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Sovuqdan kirgach, darhol qaynoq radiatorga qo‘l qo‘ymang (kapillyarlar yoriladi).</span>
            </li>
          </ul>
        </div>

        {/* Summer */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Yozgi quyosh va issiqda</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>Qo‘lning ustki qismiga ham SPF 30-50 quyosh kremini surtishni unutmang.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>Ko‘p terlasha moyil bo‘lsa, yengil teksturali aloe vera va pantenol gellarini tanlang.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>Bog‘-tomorqa ishlarida yer bilan to‘g‘ridan-to‘g‘ri aloqadan himoyalaning.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
