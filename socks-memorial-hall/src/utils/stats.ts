import { SockMemorial, SockTone } from '../types/sock';
import { calculateDDay } from './date';

export function computeMemorialStats(socks: SockMemorial[]) {
  const totalCount = socks.length;
  const reunitedCount = socks.filter((s) => s.isReunited).length;
  const maxMissingDays = socks.reduce((max, sock) => {
    if (sock.isReunited) return max;
    return Math.max(max, calculateDDay(sock.lastSeenDate));
  }, 0);
  return { totalCount, reunitedCount, maxMissingDays };
}

export function computeActivitySummary(socks: SockMemorial[]) {
  const totalTributeCount = socks.reduce((sum, s) => sum + s.tributeCount, 0);
  const toneCounts: Record<SockTone, number> = { 신파: 0, 코믹: 0, 시적: 0 };
  socks.forEach((s) => {
    toneCounts[s.tone] += 1;
  });
  const sharedCount = socks.filter((s) => s.isShared).length;
  return { totalTributeCount, toneCounts, sharedCount };
}
