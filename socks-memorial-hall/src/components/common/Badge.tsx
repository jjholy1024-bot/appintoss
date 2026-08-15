import React from 'react';
import { SockTone } from '../../types/sock';

interface DDayBadgeProps {
  dDay: number;
  isReunited?: boolean;
  tone?: SockTone;
  compact?: boolean;
}

export const DDayBadge: React.FC<DDayBadgeProps> = ({ dDay, isReunited, tone, compact = false }) => {
  if (isReunited) {
    return (
      <span className={`memorial-badge badge-reunited ${compact ? 'badge-compact' : ''}`}>
        재회 🎉
      </span>
    );
  }

  if (dDay >= 49) {
    return (
      <span className={`memorial-badge badge-49 ${compact ? 'badge-compact' : ''}`}>
        D+{dDay} (49재 🕯️)
      </span>
    );
  }

  return (
    <span className={`memorial-badge badge-normal ${compact ? 'badge-compact' : ''}`}>
      D+{dDay} {tone ? `· ${tone} 톤` : ''}
    </span>
  );
};
