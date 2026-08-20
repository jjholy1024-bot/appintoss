export type SockTone = '신파' | '코믹' | '시적';

export interface SockMemorial {
  id: string;
  name: string;
  photoUrl: string;
  wornSince: string;
  lastSeenDate: string; // YYYY-MM-DD
  location: string;
  tone: SockTone;
  letter: string;
  createdAt: string;
  isReunited: boolean;
  reunitedDate?: string;
  tributeCount: number;
  has49Addendum?: boolean;
  hasReunionAddendum?: boolean;
  reunionAddendumText?: string; // 되돌리기 시 letter에서 이 문단만 제거하기 위해 원문 보관
  isShared?: boolean; // 친구에게 공유 링크를 만든 적 있는지
}

export type ViewMode = 'home' | 'gallery' | 'upload' | 'letter_result' | 'detail' | 'settings';
