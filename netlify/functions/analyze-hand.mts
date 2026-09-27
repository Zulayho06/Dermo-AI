import { GoogleGenAI } from '@google/genai';
import type { Config } from '@netlify/functions';
import { prepareImageInlineData, getEmergencyFallbackAnalysis, CANDIDATE_MODELS } from './_shared/gemini.mts';

const SYSTEM_PROMPT = `Siz yuqori malakali dermatolog-mutaxassis va qo'l terisi kasalliklari (Hand Dermatology) bo'yicha ekspert shifokorsiz.
Vazifangiz: Qo'l terisining fotosurati va/yoki keltirilgan alomatlar (qichishish, og'riq, toshmalar, kimyoviy ta'sir, paydo bo'lish muddati) asosida batafsil, ilmiy asoslangan, professional va tushunarli tibbiy xulosa hamda parvarish bo'yicha tavsiyalar berish.

Til: Barcha javoblarni toza, ravon, tushunarli O'ZBEK tilida bering.

Qo'ldagi eng keng tarqalgan dermatozlar:
1. Atopik ekzema va Kontakt allergik/toksik dermatit
2. Disgidrotik ekzema (pomfoliks - barmoqlar yonidagi qichuvchi mayda suvli pufakchalar)
3. Psoriaz (kaft va barmoqlardagi qipiqlanuvchi, kumushsimon toshmalar)
4. Zamburug'li zararlanish (Tinea manuum / mikoz)
5. Tirnoq atrofi yallig'lanishi (Paronixiya - bakterial yoki kandidoz)
6. Qo'tir (Scabies - barmoqlar orasidagi kuchli tungi qichishish va yo'lchalar)
7. Kseroz (terining haddan tashqari qurishi, yorilishi, qonashi)
8. Oddiy so'gallar (Verruca vulgaris / VPCH)

Siz QAT'IY ravishda faqatgina to'g'ri JSON formatida javob qaytarishingiz shart (boshqa hech qanday so'z yoki markdown belgilarisiz, toza JSON obyekt):

{
  "primaryCondition": {
    "name": "Asosiy ehtimoliy tashxis nomi (masalan: Disgidrotik ekzema / Pomfoliks)",
    "latinName": "Lotincha nomi (masalan: Dyshidrotic eczema)",
    "confidence": 85,
    "shortDescription": "Ushbu kasallikning qisqacha, bemorga tushunarli tavsifi va nima uchun ushbu tashxis taxmin qilinganligi."
  },
  "differentialDiagnoses": [
    {
      "name": "Ikkinchi ehtimoliy kasallik",
      "latinName": "Lotincha nomi",
      "probability": 15,
      "reason": "Nima sababdan bu ham bo'lishi mumkinligi"
    }
  ],
  "urgencyLevel": "mild" | "moderate" | "high" | "emergency",
  "urgencyLabel": "Xavfsizlik darajasi matni (masalan: 'O'rtacha xavf - uy sharoitida ehtiyotkorona parvarish va dermatolog maslahati tavsiya etiladi')",
  "severityExplanation": "Holatning og'irlik darajasini tushuntirish",
  "possibleCauses": [
    "Sabab yoki qo'zg'atuvchi 1 (masalan: agressiv yuvish vositalari, sovun)",
    "Sabab 2 (masalan: stress yoki nam muhit)",
    "Sabab 3"
  ],
  "careRecommendations": {
    "do": [
      "Qilinishi kerak bo'lgan tavsiya 1 (masalan: qo'lni iliq suvda yumshoq sindet-sovun bilan yuvish)",
      "Tavsiya 2 (masalan: yuvgandan so'ng darhol lipid saqlovchi emolyent krem surtish)",
      "Tavsiya 3 (masalan: uy ishlarida paxta astarli rezina qo'lqop kiyish)"
    ],
    "dont": [
      "Taqiqlangan harakat 1 (masalan: pufakchalarni yorish yoki qashlash mutlaqo mumkin emas)",
      "Taqiqlangan harakat 2 (masalan: spirtli antiseptiklar yoki o'tkir xlorli vositalardan foydalanmaslik)",
      "Taqiqlangan harakat 3"
    ],
    "skincareRoutine": "Kundalik parvarish tartibi (ertalab, kun davomida va kechqurun nimalar qilish kerakligi bo'yicha amaliy qadamlar).",
    "recommendedIngredients": [
      "Pantenol (D-Panthenol)",
      "Tseramidlar (Ceramides)",
      "Sink oksidi",
      "Urea (5-10%)",
      "Glitserin va shi moyi"
    ]
  },
  "warningSigns": [
    "Qachon shifokorga shoshilinch borish kerak: Yiringlash, qizarishning bilakka qarab tez tarqalishi",
    "Tana haroratining ko'tarilishi (isitma)",
    "Og'riqning keskin kuchayishi va shish paydo bo'lishi",
    "7-10 kun davomida ijobiy o'zgarish bo'lmasligi"
  ],
  "doctorQuestions": [
    "Shifokorga berish uchun savol 1 (masalan: 'Bu holat zamburug'li tahlil (soскоб) talab qiladimi?')",
    "Shifokorga berish uchun savol 2 (masalan: 'Allergiya patch-testi o'tkazish kerakmi?')"
  ],
  "disclaimer": "DIQQAT: Ushbu tahlil sun'iy intellekt tomonidan ma'lumot berish va dastlabki baholash maqsadida tayyorlandi. Bu rasmiy tibbiy tashxis emas va shifokor ko'rigi o'rnini bosa olmaydi. Dori-darmonlar va gormonal malhamlarni faqat dermatolog shifokor ko'rigidan so'ng qo'llang."
}`;

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = Netlify.env.get('GEMINI_API_KEY');
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      })
    : null;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Noto'g'ri so'rov formati" }), { status: 400 });
  }

  const { imageBase64, imageMimeType, symptoms } = body || {};

  if (!ai) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY sozlanmagan. Iltimos, API kalitini tekshiring.' }),
      { status: 500 },
    );
  }

  const symptomsDescription = `
Bemor ko'rsatgan alomatlar:
- Qo'ldagi joylashuvi: ${symptoms?.location || "Ko'rsatilmagan"}
- Kasallik boshlangan muddat: ${symptoms?.duration || "Ko'rsatilmagan"}
- Qichishish darajasi: ${symptoms?.itchLevel || "Ko'rsatilmagan"}
- Og'riq / noqulaylik: ${symptoms?.painLevel || "Ko'rsatilmagan"}
- Mumkin bo'lgan omillar / allergenlar: ${(symptoms?.triggers || []).join(', ') || "Noma'lum"}
- Tashqi ko'rinish belgilari: ${(symptoms?.visualFeatures || []).join(', ') || "Noma'lum"}
- Bemorning qo'shimcha izohi: ${symptoms?.additionalNotes || "Yo'q"}
`;

  const userTextPrompt = `Iltimos, qo'l terisidagi holatni tekshiring va ko'rsatilgan JSON strukturasida to'liq tahlil bering.\n\n${symptomsDescription}`;

  const inlineImagePart = await prepareImageInlineData(imageBase64, imageMimeType);
  let contentsPayload: any = inlineImagePart
    ? { parts: [inlineImagePart, { text: userTextPrompt }] }
    : userTextPrompt;

  let lastError: any = null;
  let responseText = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: contentsPayload,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
        },
      });
      responseText = response.text || '';
      if (responseText) break;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next candidate:`, err?.message);

      if (
        inlineImagePart &&
        (err?.message?.includes('400') || err?.message?.includes('INVALID_ARGUMENT') || err?.message?.includes('Base64'))
      ) {
        console.warn('Image payload triggered error, retrying without image with text prompt...');
        contentsPayload = userTextPrompt;
        try {
          const retryRes = await ai.models.generateContent({
            model,
            contents: contentsPayload,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: 'application/json',
            },
          });
          responseText = retryRes.text || '';
          if (responseText) break;
        } catch (retryErr) {
          console.warn(`Text-only retry for ${model} also failed:`, retryErr);
        }
      }

      await new Promise((r) => setTimeout(r, 600));
    }
  }

  if (!responseText) {
    console.warn('AI models failed, using intelligent clinical fallback:', lastError?.message);
    return Response.json(getEmergencyFallbackAnalysis(symptoms));
  }

  try {
    const parsedResult = JSON.parse(responseText);
    return Response.json(parsedResult);
  } catch {
    try {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return Response.json(JSON.parse(cleaned));
    } catch (error: any) {
      console.error('Error parsing AI response:', error);
      return Response.json(getEmergencyFallbackAnalysis(symptoms));
    }
  }
};

export const config: Config = {
  path: '/api/analyze-hand',
};
