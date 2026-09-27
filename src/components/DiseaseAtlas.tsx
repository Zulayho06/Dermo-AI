import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { HAND_DISEASES } from '../data/handDiseases';
import { DiseaseInfo } from '../types/dermatology';

interface DiseaseAtlasProps {
  onSelectForCheckup?: (disease: DiseaseInfo) => void;
}

export const DiseaseAtlas: React.FC<DiseaseAtlasProps> = ({ onSelectForCheckup }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(HAND_DISEASES[0].id);

  const categories = [
    { id: 'all', label: 'Barcha kasalliklar' },
    { id: 'ekzema', label: 'Ekzema turlari' },
    { id: 'allergik', label: 'Allergik va kontakt' },
    { id: 'infeksion', label: 'Zamburug‘ va infeksiyalar' },
    { id: 'autoimmun', label: 'Psoriaz va autoimmun' },
    { id: 'mavsumiy', label: 'Mavsumiy / Kseroz' },
  ];

  const filtered = HAND_DISEASES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName = item.name.toLowerCase().includes(query) || item.latinName.toLowerCase().includes(query);
    const matchesDesc = item.shortDesc.toLowerCase().includes(query);
    const matchesSymptoms = item.symptoms.some(s => s.toLowerCase().includes(query));

    return matchesCategory && (matchesName || matchesDesc || matchesSymptoms);
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-gradient-to-r from-teal-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Klinik Ma’lumotlar Bazasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Qo‘l Terisi Kasalliklari Ensiklopediyasi
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Qo‘l sohasidagi keng tarqalgan dermatozlar, ularning o‘ziga xos klinik alomatlari, sabablari va profilaktikasi bo‘yicha ishonchli tibbiy qo‘llanma.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-6 relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Alomat yoki kasallik nomi bo‘yicha qidiring (masalan: 'pufakcha', 'tirnoq', 'psoriaz')..."
            className="w-full bg-white text-slate-900 pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Disease Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700">Hech qanday ma’lumot topilmadi</h4>
            <p className="text-xs text-slate-500 mt-1">
              Boshqa so‘z yoki belgi kiritib ko‘ring yoki barcha kasalliklar filtrini tanlang.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                  isExpanded ? 'border-teal-500 ring-1 ring-teal-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header button */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400 italic">
                        {item.latinName}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">
                      {item.shortDesc}
                    </p>
                  </div>

                  <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 transition-transform ${isExpanded ? 'rotate-90 bg-teal-50 text-teal-700 border-teal-300' : 'text-slate-400'}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-slate-100 space-y-5 animate-fadeIn">
                    {/* Symptoms & Causes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Symptoms */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          <span>Asosiy alomatlari</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {item.symptoms.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-teal-600 font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Causes */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-amber-600" />
                          <span>Sabablari va keltirib chiqaruvchi omillar</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {item.causes.map((c, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Prevention and Care tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Prevention */}
                      <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-200/70">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-teal-900 mb-2.5 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-teal-700" />
                          <span>Profilaktika va himoya</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {item.prevention.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-teal-700 font-bold">✓</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Care Tips */}
                      <div className="bg-cyan-50/50 rounded-2xl p-4 border border-cyan-200/70">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-900 mb-2.5 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-cyan-700" />
                          <span>Parvarishlash bo‘yicha maslahatlar</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {item.careTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-700 font-bold">➔</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {onSelectForCheckup && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onSelectForCheckup(item)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <span>Menda shunga o‘xshash holat bor — Tahlil qilish</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
