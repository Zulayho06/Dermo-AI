import { GoogleGenAI } from '@google/genai';
import type { Config } from '@netlify/functions';
import { CANDIDATE_MODELS } from './_shared/gemini.mts';

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

  const { messages, currentContext } = body || {};

  if (!ai) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY sozlanmagan.' }), { status: 500 });
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

  let lastError: any = null;
  let replyText = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: formattedContents,
        config: { systemInstruction },
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
    console.error('Error in consult chat:', lastError);
    return Response.json(
      { error: 'Xatolik: ' + (lastError?.message || "Konsultatsiya xizmati vaqtincha band") },
      { status: 500 },
    );
  }

  return Response.json({ reply: replyText });
};

export const config: Config = {
  path: '/api/consult-chat',
};
