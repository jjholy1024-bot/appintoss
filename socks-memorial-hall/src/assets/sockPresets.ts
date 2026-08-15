export interface SockPreset {
  id: string;
  name: string;
  emoji: string;
  svgDataUrl: string;
}

function createSockSvg(primaryColor: string, secondaryColor: string, pattern: 'stripes' | 'dots' | 'solid' | 'fluffy'): string {
  let patternContent = '';
  if (pattern === 'stripes') {
    patternContent = `
      <path d="M40 70 L90 70" stroke="${secondaryColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M40 95 L90 95" stroke="${secondaryColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M42 120 L88 120" stroke="${secondaryColor}" stroke-width="8" stroke-linecap="round"/>
    `;
  } else if (pattern === 'dots') {
    patternContent = `
      <circle cx="55" cy="75" r="5" fill="${secondaryColor}"/>
      <circle cx="75" cy="85" r="5" fill="${secondaryColor}"/>
      <circle cx="55" cy="105" r="5" fill="${secondaryColor}"/>
      <circle cx="75" cy="115" r="5" fill="${secondaryColor}"/>
      <circle cx="65" cy="140" r="5" fill="${secondaryColor}"/>
    `;
  } else if (pattern === 'fluffy') {
    patternContent = `
      <circle cx="50" cy="45" r="7" fill="${secondaryColor}"/>
      <circle cx="65" cy="42" r="8" fill="${secondaryColor}"/>
      <circle cx="80" cy="45" r="7" fill="${secondaryColor}"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <defs>
      <linearGradient id="grad-${primaryColor.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="${primaryColor}dd"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/>
      </filter>
    </defs>
    <rect width="160" height="160" rx="32" fill="#F8FAFC"/>
    <g filter="url(#shadow)">
      <!-- Main Sock Body -->
      <path d="M50 45 C50 40 54 36 60 36 L70 36 C76 36 80 40 80 45 L80 110 C80 125 95 130 115 130 C125 130 130 122 130 115 C130 102 115 95 100 95 L80 95" 
            fill="none" stroke="url(#grad-${primaryColor.replace('#','')})" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Heel Accent -->
      <path d="M45 105 C45 125 60 130 75 130" fill="none" stroke="${secondaryColor}" stroke-width="12" stroke-linecap="round"/>
      <!-- Toe Accent -->
      <path d="M120 120 C128 120 130 115 130 110" fill="none" stroke="${secondaryColor}" stroke-width="14" stroke-linecap="round"/>
      <!-- Top Cuff -->
      <path d="M48 38 L82 38" stroke="${secondaryColor}" stroke-width="8" stroke-linecap="round"/>
      ${patternContent}
    </g>
    <!-- Cute Eyes & expression -->
    <circle cx="60" cy="62" r="3" fill="#1E293B"/>
    <circle cx="70" cy="62" r="3" fill="#1E293B"/>
    <path d="M63 68 Q65 72 67 68" stroke="#1E293B" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="67" r="2.5" fill="#F472B6" opacity="0.6"/>
    <circle cx="74" cy="67" r="2.5" fill="#F472B6" opacity="0.6"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SOCK_PRESETS: SockPreset[] = [
  {
    id: 'preset_yellow_stripes',
    name: '노란 줄무늬 양말',
    emoji: '🧦',
    svgDataUrl: createSockSvg('#FBBF24', '#F59E0B', 'stripes')
  },
  {
    id: 'preset_blue_cozy',
    name: '하늘빛 포근 양말',
    emoji: '☁️',
    svgDataUrl: createSockSvg('#38BDF8', '#0284C7', 'stripes')
  },
  {
    id: 'preset_pink_fluffy',
    name: '핑크 수면양말',
    emoji: '🌸',
    svgDataUrl: createSockSvg('#F472B6', '#DB2777', 'fluffy')
  },
  {
    id: 'preset_green_forest',
    name: '초록 스트라이프',
    emoji: '🌲',
    svgDataUrl: createSockSvg('#34D399', '#059669', 'stripes')
  },
  {
    id: 'preset_purple_dots',
    name: '도트무늬 보라양말',
    emoji: '🍇',
    svgDataUrl: createSockSvg('#A78BFA', '#7C3AED', 'dots')
  },
  {
    id: 'preset_charcoal_classic',
    name: '클래식 차콜양말',
    emoji: '💼',
    svgDataUrl: createSockSvg('#64748B', '#334155', 'solid')
  }
];
