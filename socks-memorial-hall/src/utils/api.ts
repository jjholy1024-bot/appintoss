import { SockMemorial } from '../types/sock';

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://appintoss-e4lce9dud-jjholy1024-5602s-projects.vercel.app';

interface GenerateLetterParams {
  mode: 'new' | '49days' | 'reunited';
  name: string;
  wornSince: string;
  lastSeenDate: string;
  location: string;
  tone: string;
  previousLetter?: string;
}

export async function callGenerateLetter(params: GenerateLetterParams): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/generate-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('편지 생성 실패');
  const data = await res.json();
  return data.letter as string;
}

export async function publishSharedSock(id: string, sock: unknown): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/shared-sock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, sock }),
  });
  if (!res.ok) throw new Error('공유 등록 실패');
}

export async function fetchSharedSock(id: string): Promise<{ sock: SockMemorial; tributeCount: number }> {
  const res = await fetch(`${BACKEND_URL}/api/shared-sock?id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('공유 카드를 찾을 수 없어요');
  return res.json();
}



export async function addSharedTribute(id: string): Promise<number> {
  const res = await fetch(`${BACKEND_URL}/api/tribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('헌화 실패');
  const data = await res.json();
  return data.tributeCount as number;
}