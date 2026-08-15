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
}

export type ViewMode = 'gallery' | 'upload' | 'letter_result' | 'detail';
