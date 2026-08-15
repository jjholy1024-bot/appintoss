import { SockMemorial } from '../types/sock';
import { calculateDDay, formatDateKorean } from './date';

/**
 * Render the memorial card onto an offscreen canvas and trigger PNG download
 */
export async function downloadCardAsImage(sock: SockMemorial): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 800;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;

  const dDay = calculateDDay(sock.lastSeenDate);
  const is49 = dDay >= 49 && !sock.isReunited;

  // Background: #F7F5F0 (화이트 아이보리)
  ctx.fillStyle = '#F7F5F0';
  ctx.fillRect(0, 0, width, height);

  // Card Frame: #FFFFFF
  ctx.save();
  ctx.shadowColor = 'rgba(58, 54, 46, 0.12)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, 40, 40, width - 80, height - 80, 24);
  ctx.fill();
  ctx.restore();

  // Border: #A69A85
  ctx.strokeStyle = is49 ? '#B5502E' : '#A69A85';
  ctx.lineWidth = 3;
  roundRect(ctx, 40, 40, width - 80, height - 80, 24);
  ctx.stroke();

  // Top color banner
  const toneColors: Record<string, string> = {
    '신파': '#B5502E',
    '코믹': '#C67E28',
    '시적': '#5E7A60',
  };
  ctx.fillStyle = is49 ? '#B5502E' : (toneColors[sock.tone] || '#B5502E');
  roundRect(ctx, 40, 40, width - 80, 16, 24);
  ctx.fill();
  ctx.fillRect(40, 48, width - 80, 8);

  // Header Title
  ctx.fillStyle = '#3A362E';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧦 양 말 추 모 관', width / 2, 105);

  // Photo Circle (#EAE5DA)
  const photoSize = 180;
  const photoX = (width - photoSize) / 2;
  const photoY = 135;

  ctx.fillStyle = '#EAE5DA';
  ctx.beginPath();
  ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2 + 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw Photo
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = sock.photoUrl;
  });

  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
  ctx.clip();
  try {
    ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
  } catch {
    ctx.fillStyle = '#EAE5DA';
    ctx.fillRect(photoX, photoY, photoSize, photoSize);
  }
  ctx.restore();

  // Sock Name
  ctx.fillStyle = '#3A362E';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(sock.name, width / 2, 365);

  // Sub metadata
  ctx.fillStyle = '#A69A85';
  ctx.font = '20px sans-serif';
  const subtitle = `실종 ${dDay}일째 (${formatDateKorean(sock.lastSeenDate)} 실종) · ${sock.tone} 톤`;
  ctx.fillText(subtitle, width / 2, 400);

  // Quote Box (#F7F5F0)
  ctx.fillStyle = '#F7F5F0';
  roundRect(ctx, 80, 435, width - 160, 480, 18);
  ctx.fill();
  ctx.strokeStyle = '#EAE5DA';
  ctx.lineWidth = 2;
  roundRect(ctx, 80, 435, width - 160, 480, 18);
  ctx.stroke();

  // Quote Marks
  ctx.fillStyle = '#A69A85';
  ctx.font = 'italic 48px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('“', 105, 480);

  // Letter Text wrap
  ctx.fillStyle = '#3A362E';
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'left';
  const maxWidth = width - 230;
  const lineHeight = 36;
  let textY = 515;

  const lines = sock.letter.split('\n');
  for (const para of lines) {
    if (!para.trim()) {
      textY += lineHeight * 0.6;
      continue;
    }
    const words = para.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth) {
        ctx.fillText(currentLine, 115, textY);
        currentLine = word;
        textY += lineHeight;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      ctx.fillText(currentLine, 115, textY);
      textY += lineHeight;
    }
  }

  // Quote Mark Close
  ctx.fillStyle = '#A69A85';
  ctx.font = 'italic 48px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText('”', width - 105, 895);

  // Footer info
  ctx.fillStyle = '#A69A85';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`함께한 기간: ${sock.wornSince} | 마지막 위치: ${sock.location}`, width / 2, 955);

  ctx.fillStyle = '#B5502E';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('토스 양말 추모관에서 영원히 기억합니다', width / 2, 990);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `양말추모관_${sock.name.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export async function shareCard(sock: SockMemorial): Promise<'shared' | 'copied'> {
  const dDay = calculateDDay(sock.lastSeenDate);
  const title = `[양말 추모관] ${sock.name}의 마지막 편지`;
  const text = `🧦 [양말 추모관]\n"${sock.name}" (실종 ${dDay}일째 · ${sock.tone} 톤)\n\n"${sock.letter.slice(0, 120)}..."\n\n토스 양말 추모관에서 기억해주세요.`;
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch {
      // User cancelled
    }
  }

  await navigator.clipboard.writeText(`${text}\n${url}`);
  return 'copied';
}
