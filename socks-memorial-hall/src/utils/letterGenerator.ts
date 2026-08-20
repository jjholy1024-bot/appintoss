import { SockTone } from '../types/sock';
import { callGenerateLetter } from './api';
import { generateLetterFallback } from './letterGenerator.fallback';

interface LetterParams {
  name: string;
  wornSince: string;
  lastSeenDate: string;
  location: string;
  tone: SockTone;
}

/**
 * 새 양말 등록 시 이별 편지 생성.
 * AI 백엔드 호출 실패 시(네트워크 문제, 백엔드 미배포 등) 기존 템플릿으로 자동 대체돼요.
 */
export async function generateLetter(params: LetterParams): Promise<string> {
  try {
    return await callGenerateLetter({ mode: 'new', ...params });
  } catch (err) {
    console.warn('AI 편지 생성 실패, 템플릿으로 대체합니다.', err);
    return generateLetterFallback(params);
  }
}

/**
 * 49재 / 재회 추가 문단 생성. 실패 시 null 반환 (호출 측에서 스킵 처리).
 */
export async function generateAddendum(
  mode: '49days' | 'reunited',
  params: LetterParams & { previousLetter: string }
): Promise<string | null> {
  try {
    return await callGenerateLetter({ mode, ...params });
  } catch (err) {
    console.warn('추가 문단 생성 실패', err);
    return null;
  }
}
