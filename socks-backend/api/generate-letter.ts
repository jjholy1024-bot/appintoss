import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const TONE_GUIDE: Record<string, string> = {
  신파: '눈물샘을 자극하는 신파 멜로 톤. 과장된 그리움과 애틋함, 이별의 슬픔을 절절하게 표현해줘.',
  코믹: '유쾌하고 능청스러운 코믹 톤. 양말이 뻔뻔하게 너스레를 떨며 탈출/은퇴를 자축하는 느낌으로, 드립과 이모지를 섞어줘.',
  시적: '차분하고 은유적인 시적 톤. 감각적인 이미지와 여백이 있는 문장으로 담담하게 써줘.',
};

interface GenerateLetterBody {
  mode: 'new' | '49days' | 'reunited';
  name: string;
  wornSince: string;
  lastSeenDate: string;
  location: string;
  tone: string;
  previousLetter?: string;
}

function buildPrompt(body: GenerateLetterBody): string {
  const { mode, name, wornSince, location, tone, previousLetter } = body;
  const toneGuide = TONE_GUIDE[tone] || TONE_GUIDE['신파'];
  const sockName = name || '이름 없는 양말';
  const loc = location || '알 수 없는 어딘가';
  const since = wornSince || '어느 날';

  if (mode === '49days') {
    return `너는 실종된 양말 '${sockName}'이야. 아래는 네가 예전에 주인에게 남긴 이별 편지의 일부야 (참고용 맥락일 뿐, 그대로 반복하면 안 돼):\n\n<previous_letter>\n${previousLetter}\n</previous_letter>\n\n오늘은 네가 사라진 지 49일째 되는 날(불교의 49재 풍습에서 따온 설정)이야. 이 편지 뒤에 이어붙일 짧은 추가 문단을 2~4문장으로 새로 써줘. ${toneGuide} 49일이라는 시간의 의미를 담아줘.\n\n중요: <previous_letter> 안의 문장을 인용하거나 반복하지 마. 따옴표, 인사말, 서명, 설명 없이 오직 새로 이어지는 문단만 출력해.`;
  }

  if (mode === 'reunited') {
    return `너는 실종되었다가 방금 극적으로 다시 발견된 양말 '${sockName}'이야. 아래는 네가 예전에 주인에게 남긴 이별 편지의 일부야 (참고용 맥락일 뿐, 그대로 반복하면 안 돼):\n\n<previous_letter>\n${previousLetter}\n</previous_letter>\n\n이제 다시 만나게 된 기쁨을 담은 짧은 추가 문단을 2~4문장으로 새로 써줘. ${toneGuide} 재회의 감동과 반가움을 담아줘.\n\n중요: <previous_letter> 안의 문장을 인용하거나 반복하지 마. 따옴표, 인사말, 서명, 설명 없이 오직 새로 이어지는 문단만 출력해.`;
  }

  return `너는 세탁 중 한 짝만 실종된 양말 '${sockName}'이야. ${since}부터 주인과 함께했고, ${loc}에서 마지막으로 목격되었어. 주인에게 남기는 이별 편지를 써줘. ${toneGuide}

조건:
- 3~4개 문단, 문단 사이는 줄바꿈 두 번으로 구분
- 양말의 시점에서 1인칭으로 작성
- 실제 장소명(${loc})과 함께한 기간(${since})을 자연스럽게 녹여줘
- 전체 200~350자 내외
- 따옴표나 부가 설명 없이 편지 본문만 출력해`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    return;
  }

  try {
    const prompt = buildPrompt(req.body as GenerateLetterBody);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 1,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    let letter = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!letter) throw new Error('Empty response from Gemini API');

    const previousLetter = (req.body as GenerateLetterBody).previousLetter;
    if (previousLetter && letter.includes(previousLetter.trim())) {
      letter = letter.split(previousLetter.trim()).join('').trim();
    }

    res.status(200).json({ letter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Letter generation failed' });
  }
}
