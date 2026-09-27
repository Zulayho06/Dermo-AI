import React from 'react';
import { Hand, Check } from 'lucide-react';

interface HandZoneSelectorProps {
  selectedZone: string;
  onSelectZone: (zone: string) => void;
}

interface ZoneItem {
  id: string;
  title: string;
  sub: string;
  commonSigns: string;
}

const ZONES: ZoneItem[] = [
  {
    id: 'Barmoqlar yon yuzasi va orasi',
    title: 'Barmoqlar yon yuzasi va orasi',
    sub: 'Interdigital & lateral',
    commonSigns: 'Disgidroz pufakchalari, qo‘tir izlari, zamburug‘'
  },
  {
    id: 'Kaft ichki yuzasi',
    title: 'Kaft ichki yuzasi',
    sub: 'Palmar soha',
    commonSigns: 'Psoriaz blyashkalari, quruq ekzema, kseroz'
  },
  {
    id: 'Qo‘l orqasi (sirti) va bilak',
    title: 'Qo‘l orqasi va bilak',
    sub: 'Dorsal soha',
    commonSigns: 'Kontakt allergik dermatit, quyosh/sovuq ta’siri'
  },
  {
    id: 'Tirnoq atrofi va kutikula',
    title: 'Tirnoq atrofi va kutikula',
    sub: 'Paronixial soha',
    commonSigns: 'Paronixiya (shish, yiring), zamburug‘, onixomikoz'
  },
  {
    id: 'Barmoq uchlari va bo‘g‘imlari',
    title: 'Barmoq uchlari va bo‘g‘imlar',
    sub: 'Distal soha',
    commonSigns: 'Yoriqlar, po‘st tashlash, so‘gallar'
  },
  {
    id: 'Butun qo‘l panjasi bo‘ylab',
    title: 'Butun qo‘l panjasi bo‘ylab',
    sub: 'Diffuz tarqalish',
    commonSigns: 'Umumiy allergik reaksiya yoki keng tarqalgan dermatoz'
  }
];

export const HandZoneSelector: React.FC<HandZoneSelectorProps> = ({
  selectedZone,
  onSelectZone
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Hand className="w-4 h-4 text-teal-600" />
          <span>1. Toshma yoki o‘zgarish qaysi sohada joylashgan?</span>
        </label>
        <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Zaruriy tanlov
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {ZONES.map((zone) => {
          const isSelected = selectedZone === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelectZone(zone.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/70 text-slate-900 shadow-sm ring-1 ring-teal-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className={`text-sm font-semibold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                    {zone.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {zone.sub}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mt-2 line-clamp-1">
                <span className="text-slate-400">Tez-tez uchraydi:</span> {zone.commonSigns}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
