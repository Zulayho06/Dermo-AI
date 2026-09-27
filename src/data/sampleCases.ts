import { HandSymptoms } from '../types/dermatology';

export interface SampleCase {
  id: string;
  title: string;
  tag: string;
  badgeColor: string;
  description: string;
  imageUrl: string;
  symptoms: HandSymptoms;
}

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'sample-1',
    title: "Barmoqlar yonidagi qichuvchi pufakchalar",
    tag: "Disgidrotik ekzema",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Barmoq chetlarida 4-5 kundan beri mayda shaffof pufakchalar toshgan, qattiq qichishyapti.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    symptoms: {
      location: "Barmoqlar yon yuzasi va kaft",
      duration: "3-5 kun",
      itchLevel: "Kuchli / Tunda bezovta qiladi",
      painLevel: "Achishish yoki sanchish",
      triggers: ["Stress / asabiylashish", "Ko'p terlash", "Idish yuvish vositasi"],
      visualFeatures: ["Mayda suvli pufakchalar", "Qizarish", "Qipiqlanish"],
      additionalNotes: "Pufakchalarni qashlaganda shaffof suyuqlik chiqmoqda va terisi qizaryapti."
    }
  },
  {
    id: 'sample-2',
    title: "Yuvish vositasidan keyingi qizarish va yoriqlar",
    tag: "Kontakt dermatit",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Oshxona tozalovchi kimyoviy xlor vositasi tekkanidan so'ng qo'l terisi qizarib, taranglashib yorildi.",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80",
    symptoms: {
      location: "Qo'l panjasining ustki qismi va barmoqlar",
      duration: "1-2 kun",
      itchLevel: "Yengil qichishish",
      painLevel: "Kuchli og'riq / achishish",
      triggers: ["Sovun/kir yuvish vositalari", "Kimyoviy moddalar / xlor"],
      visualFeatures: ["Qizarish", "Yoriqlar / qonash", "Quruqlik / taranglik"],
      additionalNotes: "Tozalash ishlaridan keyin qo'lqopsiz ishlangan edi, juda achishyapti."
    }
  },
  {
    id: 'sample-3',
    title: "Kaftdagi quruqlik va qonaydigan chuqur yoriqlar",
    tag: "Surunkali ekzema / Kseroz",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Qishda qo'llar haddan tashqari qurib ketgan, bo'g'imlarda og'riqli yoriqlar hosil bo'lgan.",
    imageUrl: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?auto=format&fit=crop&w=600&q=80",
    symptoms: {
      location: "Kaft ichi va barmoq bo'g'imlari",
      duration: "1 oydan ortiq",
      itchLevel: "O'rtacha qichishish",
      painLevel: "Achishish yoki sanchish",
      triggers: ["Sovuq ob-havo", "Sovun bilan tez-tez yuvish"],
      visualFeatures: ["Quruqlik / taranglik", "Yoriqlar / qonash", "Qipiqlanish"],
      additionalNotes: "Oddiy qo'l kremlari surtilsa achishadi va uzoq vaqt yordam bermayapti."
    }
  },
  {
    id: 'sample-4',
    title: "Tirnoq chetidagi qizarish va shish",
    tag: "Paronixiya (Yallig'lanish)",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    description: "Kutikula terisi yulinganidan keyin bosh barmoq tirnog'i cheti shishib, 'puls' urib og'riyapti.",
    imageUrl: "https://images.unsplash.com/photo-1512290900672-1f48f4bbd05c?auto=format&fit=crop&w=600&q=80",
    symptoms: {
      location: "Tirnoq atrofi / kutikula",
      duration: "2-3 kun",
      itchLevel: "Yo'q",
      painLevel: "Kuchli og'riq / shish",
      triggers: ["Mexanik jarohat / manikyur", "Suvda uzoq qolish"],
      visualFeatures: ["Qizarish", "Shish va puls uruvchi og'riq", "Yiringli nuqta"],
      additionalNotes: "Tirnoq burchagi sariq-oq tusga kirgan, tegsa kuchli og'riq beradi."
    }
  }
];
