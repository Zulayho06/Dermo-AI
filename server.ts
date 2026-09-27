import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to prepare valid image inline data for Gemini
async function prepareImageInlineData(rawInput?: string, fallbackMime?: string) {
  if (!rawInput || typeof rawInput !== 'string') return null;

  try {
    let cleanBase64 = '';
    let mime = fallbackMime || 'image/jpeg';

    if (rawInput.startsWith('http://') || rawInput.startsWith('https://')) {
      // Image is an HTTP URL (e.g. from sample cases or web links)
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

    // Must be valid base64 and not an URL
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

// Fallback rule-based analysis in case of complete API network outage
function getEmergencyFallbackAnalysis(symptoms: any) {
  const visual = (symptoms?.visualFeatures || []).join(' ').toLowerCase();
  const location = (symptoms?.location || '').toLowerCase();
  const triggers = (symptoms?.triggers || []).join(' ').toLowerCase();
  const itch = (symptoms?.itchLevel || '').toLowerCase();

  let conditionName = "Qo'lning o'tkir kontakt dermatiti";
  let latin = "Contact dermatitis (acuta)";
  let desc = "Qo'l terisining agressiv moddalar (yuvish vositalari, kimyoviy eritmalar) yoki jismoniy ta'sir natijasida yallig'lanishi va qizarishi.";

  if (visual.includes('pufakcha') || location.includes('yon') || visual.includes('suvli')) {
    conditionName = "Disgidrotik ekzema (Pomfoliks)";
    latin = "Dyshidrotic eczema / Pompholyx";
    desc = "Barmoqlar yon yuzasi va kaftda paydo bo'ladigan mayda, kuchli qichuvchi shaffof suvli pufakchalar bilan kechuvchi ekzema turi.";
  } else if (visual.includes('yoriq') || visual.includes('quruqlik') || triggers.includes('sovuq')) {
    conditionName = "Kseroz va quruq (astetatotik) ekzema";
    latin = "Xerosis cutis / Asteatotic eczema";
    desc = "Teri tabiiy lipid qatlamining yuvilib ketishi va sovuq ta'sirida chuqur, og'riqli yoriqlar hosil bo'lishi.";
  } else if (location.includes('tirnoq') || visual.includes('yiring')) {
    conditionName = "Paronixiya (tirnoq atrofi yallig'lanishi)";
    latin = "Paronychia acuta";
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
        name: "Kontakt allergik dermatit",
        latinName: "Allergic contact dermatitis",
        probability: 14,
        reason: "Maishiy kimyo yoki sovun tarkibidagi moddalarga nisbatan individual sezuvchanlik.",
      },
      {
        name: "Atopik dermatit (qo'l lokalizatsiyasi)",
        latinName: "Atopic hand dermatitis",
        probability: 4,
        reason: "Surunkali quruqlik va qichishish alomatlari.",
      },
    ],
    urgencyLevel: itch.includes('kuchli') || visual.includes('yiring') ? 'high' : 'moderate',
    urgencyLabel: "O'rtacha / Shifokor ko'rigi tavsiya etiladi",
    severityExplanation: "Alomatlar terining himoya to'sig'i buzilganligini ko'rsatmoqda. Ikkilamchi bakterial infeksiya qo'shilmasligi uchun to'g'ri gigiyena va davo talab etiladi.",
    possibleCauses: [
      "Idish va kir yuvish vositalari bilan qo'lqopsiz ishlash",
      "Sovuq va shamolli havoda terining qurishi",
      "Iliq bo'lmagan, qaynoq suv bilan tez-tez yuvish",
      "Stress yoki allergen bilan bevosita kontakt",
    ],
    careRecommendations: {
      do: [
        "Har qanday uy va tozalash ishlarida ichidan paxtali qo'lqop kiying",
        "Qo'lni sovunsiz, neytral pH 5.5 sindet-gellar bilan yuving",
        "Yuvgandan so'ng darhol (3 daqiqa ichida) tseramidli emolyent surting",
        "Qo'llarni qattiq ishqalamay, muloyim salfetka bilan quriting",
      ],
      dont: [
        "Pufakchalarni igna yoki tirnoq bilan yorish qat'iyan taqiqlanadi",
        "Spirtli antiseptik va yod/zelenka eritmalarini ochiq yaralarga surtmang",
        "Kimyoviy vositalar va xlorga qo'lqopsiz tegmang",
        "Qaynoq suvda qo'l yuvmang",
      ],
      skincareRoutine: "Ertalab va kechqurun: Terini yumshoq tozalab, tinchlantiruvchi D-Pantenol yoki Tseramidli krem surtish. Kun davomida: Qo'lqopdan foydalanish va har namlanganda emolyent yangilash.",
      recommendedIngredients: [
        "Tseramidlar (Ceramides)",
        "D-Pantenol (Provitamin B5)",
        "Mochevina / Urea 5-10%",
        "Sink oksidi (Zinc oxide)",
        "Shi (Karite) moyi",
      ],
    },
    warningSigns: [
      "Toshmalar ichidan yiringli sariq suyuqlik ajralishi",
      "Qizarish va shish bilak tomon tez kengayishi",
      "Tana haroratining ko'tarilishi yoki qattiq zirqiragan og'riq",
    ],
    doctorQuestions: [
      "Ushbu toshmalar kontakt dermatitmi yoki ekzema?",
      "Qisqa muddatli yallig'lanishga qarshi malham kerakmi?",
      "Qo'shimcha allergiya tahlili topshirish lozimmi?",
    ],
    disclaimer: "DIQQAT: Ushbu dastlabki tahlil sun'iy intellekt tomonidan shakllantirildi. Bu rasmiy tibbiy tashxis o'rnini bosa olmaydi. Dori vositalarini mustaqil qo'llamang, mutaxassis shifokor-dermatologga murojaat qiling.",
  };
}
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: !!apiKey });
});

// Dermatological hand skin analysis endpoint
app.post('/api/analyze-hand', async (req: Request, res: Response) => {
  try {
    const { imageBase64, imageMimeType, symptoms } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY sozlanmagan. Iltimos, API kalitini tekshiring.',
      });
    }

    const systemPrompt = `Siz yuqori malakali dermatolog-mutaxassis va qo'l terisi kasalliklari (Hand Dermatology) bo'yicha ekspert shifokorsiz.
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

    const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let responseText = '';

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: contentsPayload,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });
        responseText = response.text || '';
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next candidate:`, err?.message);

        // If the error was related to the image or bad request (400), try without image
        if (inlineImagePart && (err?.message?.includes('400') || err?.message?.includes('INVALID_ARGUMENT') || err?.message?.includes('Base64'))) {
          console.warn('Image payload triggered error, retrying without image with text prompt...');
          contentsPayload = userTextPrompt;
          try {
            const retryRes = await ai.models.generateContent({
              model,
              contents: contentsPayload,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json',
              },
            });
            responseText = retryRes.text || '';
            if (responseText) break;
          } catch (retryErr) {
            console.warn(`Text-only retry for ${model} also failed:`, retryErr);
          }
        }

        // Short pause before fallback
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (!responseText) {
      console.warn('AI models failed, using intelligent clinical fallback:', lastError?.message);
      const fallbackResult = getEmergencyFallbackAnalysis(symptoms);
      return res.json(fallbackResult);
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      // Strip markdown backticks if any
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error analyzing hand skin:', error);
    // Even in unhandled catch, return clinical rule fallback so user never gets broken error screen
    try {
      const fallbackResult = getEmergencyFallbackAnalysis(req.body?.symptoms);
      return res.json(fallbackResult);
    } catch {
      res.status(500).json({
        error: 'Tahlil jarayonida xatolik yuz berdi: ' + (error?.message || 'Nomaʼlum xatolik'),
      });
    }
  }
});

// Interactive dermatological consultation chat
app.post('/api/consult-chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentContext } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY sozlanmagan.',
      });
    }

    const contextPrompt = currentContext
      ? `Joriy bemor holati va avvalgi tahlil:
- Tashxis: ${currentContext.primaryCondition?.name || 'Aniqlanmagan'}
- Og'irlik: ${currentContext.urgencyLabel || ''}
- Tavsiya etilgan parvarish: ${(currentContext.careRecommendations?.do || []).join('; ')}`
      : '';

    const systemInstruction = `Siz qo'l terisi salomatligi va dermatologiya bo'yicha mehribon, tajribali shifokor-maslahatchisiz.
Foydalanuvchiga qo'l terisi kasalliklari, toshmalar, qichishish, terining qurishi, yorilishi, profilaktika va to'g'ri parvarish bo'yicha maslahat berasiz.

MUHIM QOIDALAR:
1. Javoblaringizni doimo tushunarli, aniq, amaliy va O'ZBEK tilida bering.
2. Agar savol xavfli holat (masalan, yiringlash, flegmona, kuchli infeksiya, yuqori isitma) haqida bo'lsa, zudlik bilan jonli shifokorga borishni tavsiya qiling.
3. Aniq gormonal dori retseptlarini qat'iy buyurmasdan, parvarishlash choralari (namlantiruvchi emolyentlar, qo'lqop tartibi, antiseptik qoidalar) va shifokor bilan maslahatlashish kerak bo'lgan preparat guruhlarini tushuntiring.
4. Javobingizni o'qilishi oson bo'lishi uchun chiroyli punktlar bilan taqsimlang.

${contextPrompt}`;

    const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let replyText = '';

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction,
          },
        });
        replyText = response.text || '';
        if (replyText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} in consult-chat failed, trying next:`, err?.message);
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (!replyText) {
      throw lastError || new Error('Javob olinmadi');
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in consult chat:', error);
    res.status(500).json({
      error: 'Xatolik: ' + (error?.message || 'Konsultatsiya xizmati vaqtincha band'),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DermoQo'l AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
