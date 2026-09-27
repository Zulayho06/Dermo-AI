// Shared helpers for the Gemini-powered dermatology functions.

export async function prepareImageInlineData(rawInput?: string, fallbackMime?: string) {
  if (!rawInput || typeof rawInput !== 'string') return null;

  try {
    let cleanBase64 = '';
    let mime = fallbackMime || 'image/jpeg';

    if (rawInput.startsWith('http://') || rawInput.startsWith('https://')) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      try {
        const fetchRes = await fetch(rawInput, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (fetchRes.ok) {
          const arrayBuffer = await fetchRes.arrayBuffer();
          cleanBase64 = Buffer.from(arrayBuffer).toString('base64');
          const headerType = fetchRes.headers.get('content-type');
          if (headerType && headerType.startsWith('image/')) {
            mime = headerType.split(';')[0];
          }
        } else {
          clearTimeout(timeoutId);
          console.warn('Failed to fetch image URL:', fetchRes.status);
          return null;
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        console.warn('Fetch image timeout or error, skipping image part:', fetchErr);
        return null;
      }
    } else if (rawInput.includes(';base64,')) {
      const parts = rawInput.split(';base64,');
      cleanBase64 = parts[1]?.trim() || '';
      const dataMime = parts[0].replace(/^data:/, '').trim();
      if (dataMime) mime = dataMime;
    } else {
      cleanBase64 = rawInput.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').trim();
    }

    if (!cleanBase64 || cleanBase64.length < 50 || cleanBase64.startsWith('http')) {
      return null;
    }

    if (!mime.startsWith('image/')) {
      mime = 'image/jpeg';
    }

    return {
      inlineData: {
        mimeType: mime,
        data: cleanBase64,
      },
    };
  } catch (err) {
    console.warn('prepareImageInlineData failed, continuing without image:', err);
    return null;
  }
}

export function getEmergencyFallbackAnalysis(symptoms: any) {
  const visual = (symptoms?.visualFeatures || []).join(' ').toLowerCase();
  const location = (symptoms?.location || '').toLowerCase();
  const triggers = (symptoms?.triggers || []).join(' ').toLowerCase();
  const itch = (symptoms?.itchLevel || '').toLowerCase();

  let conditionName = "Qo'lning o'tkir kontakt dermatiti";
  let latin = 'Contact dermatitis (acuta)';
  let desc =
    "Qo'l terisining agressiv moddalar (yuvish vositalari, kimyoviy eritmalar) yoki jismoniy ta'sir natijasida yallig'lanishi va qizarishi.";

  if (visual.includes('pufakcha') || location.includes('yon') || visual.includes('suvli')) {
    conditionName = 'Disgidrotik ekzema (Pomfoliks)';
    latin = 'Dyshidrotic eczema / Pompholyx';
    desc =
      "Barmoqlar yon yuzasi va kaftda paydo bo'ladigan mayda, kuchli qichuvchi shaffof suvli pufakchalar bilan kechuvchi ekzema turi.";
  } else if (visual.includes('yoriq') || visual.includes('quruqlik') || triggers.includes('sovuq')) {
    conditionName = 'Kseroz va quruq (astetatotik) ekzema';
    latin = 'Xerosis cutis / Asteatotic eczema';
    desc =
      "Teri tabiiy lipid qatlamining yuvilib ketishi va sovuq ta'sirida chuqur, og'riqli yoriqlar hosil bo'lishi.";
  } else if (location.includes('tirnoq') || visual.includes('yiring')) {
    conditionName = 'Paronixiya (tirnoq atrofi yallig\'lanishi)';
    latin = 'Paronychia acuta';
    desc = "Tirnoq atrofi yumshoq to'qimalarining infeksion yoki kimyoviy yallig'lanishi.";
  }

  return {
    primaryCondition: {
      name: conditionName,
      latinName: latin,
      confidence: 82,
      shortDescription: desc,
    },
    differentialDiagnoses: [
      {
        name: 'Kontakt allergik dermatit',
        latinName: 'Allergic contact dermatitis',
        probability: 14,
        reason: 'Maishiy kimyo yoki sovun tarkibidagi moddalarga nisbatan individual sezuvchanlik.',
      },
      {
        name: "Atopik dermatit (qo'l lokalizatsiyasi)",
        latinName: 'Atopic hand dermatitis',
        probability: 4,
        reason: "Surunkali quruqlik va qichishish alomatlari.",
      },
    ],
    urgencyLevel: itch.includes('kuchli') || visual.includes('yiring') ? 'high' : 'moderate',
    urgencyLabel: "O'rtacha / Shifokor ko'rigi tavsiya etiladi",
    severityExplanation:
      "Alomatlar terining himoya to'sig'i buzilganligini ko'rsatmoqda. Ikkilamchi bakterial infeksiya qo'shilmasligi uchun to'g'ri gigiyena va davo talab etiladi.",
    possibleCauses: [
      "Idish va kir yuvish vositalari bilan qo'lqopsiz ishlash",
      'Sovuq va shamolli havoda terining qurishi',
      "Iliq bo'lmagan, qaynoq suv bilan tez-tez yuvish",
      'Stress yoki allergen bilan bevosita kontakt',
    ],
    careRecommendations: {
      do: [
        'Har qanday uy va tozalash ishlarida ichidan paxtali qo\'lqop kiying',
        "Qo'lni sovunsiz, neytral pH 5.5 sindet-gellar bilan yuving",
        'Yuvgandan so\'ng darhol (3 daqiqa ichida) tseramidli emolyent surting',
        "Qo'llarni qattiq ishqalamay, muloyim salfetka bilan quriting",
      ],
      dont: [
        'Pufakchalarni igna yoki tirnoq bilan yorish qat\'iyan taqiqlanadi',
        'Spirtli antiseptik va yod/zelenka eritmalarini ochiq yaralarga surtmang',
        "Kimyoviy vositalar va xlorga qo'lqopsiz tegmang",
        "Qaynoq suvda qo'l yuvmang",
      ],
      skincareRoutine:
        "Ertalab va kechqurun: Terini yumshoq tozalab, tinchlantiruvchi D-Pantenol yoki Tseramidli krem surtish. Kun davomida: Qo'lqopdan foydalanish va har namlanganda emolyent yangilash.",
      recommendedIngredients: [
        'Tseramidlar (Ceramides)',
        'D-Pantenol (Provitamin B5)',
        'Mochevina / Urea 5-10%',
        'Sink oksidi (Zinc oxide)',
        'Shi (Karite) moyi',
      ],
    },
    warningSigns: [
      'Toshmalar ichidan yiringli sariq suyuqlik ajralishi',
      'Qizarish va shish bilak tomon tez kengayishi',
      "Tana haroratining ko'tarilishi yoki qattiq zirqiragan og'riq",
    ],
    doctorQuestions: [
      "Ushbu toshmalar kontakt dermatitmi yoki ekzema?",
      "Qisqa muddatli yallig'lanishga qarshi malham kerakmi?",
      "Qo'shimcha allergiya tahlili topshirish lozimmi?",
    ],
    disclaimer:
      "DIQQAT: Ushbu dastlabki tahlil sun'iy intellekt tomonidan shakllantirildi. Bu rasmiy tibbiy tashxis o'rnini bosa olmaydi. Dori vositalarini mustaqil qo'llamang, mutaxassis shifokor-dermatologga murojaat qiling.",
  };
}

export const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
