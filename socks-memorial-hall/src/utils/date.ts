/**
 * Calculate D-day difference from a past date string (YYYY-MM-DD) to today.
 * Returns number of days elapsed (e.g. 3 for D+3).
 */
export function calculateDDay(dateStr: string): number {
  if (!dateStr) return 1;
  const targetDate = new Date(dateStr);
  const now = new Date();
  
  // Set both to start of day in local time for accurate day count
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = nowMidnight.getTime() - targetMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Format date to YYYY.MM.DD
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/**
 * Format date to Korean style (e.g. 2024년 8월 12일)
 */
export function formatDateKorean(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}년 ${m}월 ${d}일`;
}

/**
 * Returns today date formatted as YYYY-MM-DD for date input defaults
 */
export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
