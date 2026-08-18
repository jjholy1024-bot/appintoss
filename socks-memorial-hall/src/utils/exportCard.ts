import { File, Share } from '@apps-in-toss/web-framework';
import { SockMemorial } from '../types/sock';
import { calculateDDay, formatDateKorean } from './date';

interface WrappedLine {
  text: string;
  isGap: boolean;
}

function wrapLetterText(ctx: CanvasRenderingContext2D, letter: string, maxWidth: number): WrappedLine[] {
  const lines: WrappedLine[] = [];
  const paragraphs = letter.split('\n');

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push({ text: '', isGap: true });
      continue;
    }
    const words = para.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push({ text: currentLine, isGap: false });
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push({ text: currentLine, isGap: false });
  }

  return lines;
}

/**
 * Render the memorial card onto an offscreen canvas and save it as a PNG.
 * 편지 길이(AI 생성 편지 + 49재/재회 추가 문단)에 따라 카드 높이가 늘어나요 —
 * 고정 높이였을 때는 긴 편지가 하단 정보와 겹쳐 잘리는 문제가 있었어요.
 */
export async function downloadCardAsImage(sock: SockMemorial): Promise<void> {
  const width = 800;
  const dDay = calculateDDay(sock.lastSeenDate);
  const is49 = dDay >= 49 && !sock.isReunited;

  const quoteBoxTop = 435;
  const quoteBoxTextTopPadding = 80;
  const quoteBoxTextBottomPadding = 60;
  const quoteBoxMinHeight = 480;
  const letterMaxWidth = width - 230;
  const lineHeight = 36;

  // 1단계: 실제 그리기 전에 폰트 기준으로 줄바꿈을 미리 계산해서 필요한 높이를 구해요.
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');
  if (!measureCtx) return;
  measureCtx.font = '22px sans-serif';
  const wrappedLines = wrapLetterText(measureCtx, sock.letter, letterMaxWidth);
  const textBlockHeight = wrappedLines.reduce(
    (sum, line) => sum + (line.isGap ? lineHeight * 0.6 : lineHeight),
    0
  );

  const quoteBoxHeight = Math.max(
    quoteBoxMinHeight,
    quoteBoxTextTopPadding + textBlockHeight + quoteBoxTextBottomPadding
  );
  const quoteBoxBottom = quoteBoxTop + quoteBoxHeight;
  const footerInfoY = quoteBoxBottom + 40;
  const brandLineY = quoteBoxBottom + 75;
  const height = Math.round(brandLineY + 70 + 40);

  // 2단계: 계산된 높이로 실제 캔버스를 만들어서 그려요.
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = width;
  canvas.height = height;

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
  roundRect(ctx, 80, quoteBoxTop, width - 160, quoteBoxHeight, 18);
  ctx.fill();
  ctx.strokeStyle = '#EAE5DA';
  ctx.lineWidth = 2;
  roundRect(ctx, 80, quoteBoxTop, width - 160, quoteBoxHeight, 18);
  ctx.stroke();

  // Quote Marks
  ctx.fillStyle = '#A69A85';
  ctx.font = 'italic 48px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('“', 105, quoteBoxTop + 45);

  // Letter Text
  ctx.fillStyle = '#3A362E';
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'left';
  let textY = quoteBoxTop + quoteBoxTextTopPadding;
  for (const line of wrappedLines) {
    if (line.isGap) {
      textY += lineHeight * 0.6;
    } else {
      ctx.fillText(line.text, 115, textY);
      textY += lineHeight;
    }
  }

  // Quote Mark Close
  ctx.fillStyle = '#A69A85';
  ctx.font = 'italic 48px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText('”', width - 105, quoteBoxBottom - 20);

  // Footer info
  ctx.fillStyle = '#A69A85';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`함께한 기간: ${sock.wornSince} | 마지막 위치: ${sock.location}`, width / 2, footerInfoY);

  ctx.fillStyle = '#B5502E';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('토스 양말 추모관에서 영원히 기억합니다', width / 2, brandLineY);

  // Save the image — 토스 앱 웹뷰에서는 네이티브 저장 API를 쓰고,
  // 그 외 환경(브라우저 미리보기 등)에서는 <a download>로 폴백해요.
  const dataUrl = canvas.toDataURL('image/png');
  const fileName = `양말추모관_${sock.name.replace(/\s+/g, '_')}.png`;

  try {
    if (!File.saveBase64.isSupported()) throw new Error('File.saveBase64 not supported');
    const base64 = dataUrl.split(',')[1];
    await File.saveBase64({ data: base64, fileName, mimeType: 'image/png' });
    return;
  } catch {
    // 토스 앱 웹뷰가 아닌 환경 — 웹 표준 다운로드로 대체
  }

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
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

  // 토스 앱 웹뷰에서는 네이티브 공유 시트를 우선 사용해요.
  try {
    await Share.sendMessage({ message: `${text}\n${url}` });
    return 'shared';
  } catch {
    // 토스 앱 웹뷰가 아닌 환경 — 웹 표준 공유 API로 대체
  }

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch {
      // 사용자 취소
    }
  }

  await navigator.clipboard.writeText(`${text}\n${url}`);
  return 'copied';
}
