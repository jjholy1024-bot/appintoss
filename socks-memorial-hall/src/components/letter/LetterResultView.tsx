import React, { useState } from 'react';
import { Download, Share2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Header } from '../common/Header';
import { DDayBadge } from '../common/Badge';
import { SockMemorial } from '../../types/sock';
import { calculateDDay, formatDateKorean } from '../../utils/date';
import { downloadCardAsImage, shareCard } from '../../utils/exportCard';

interface LetterResultViewProps {
  sock: SockMemorial;
  onGoToGallery: () => void;
  onViewDetail: (sock: SockMemorial) => void;
}

export const LetterResultView: React.FC<LetterResultViewProps> = ({
  sock,
  onGoToGallery,
  onViewDetail,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const dDay = calculateDDay(sock.lastSeenDate);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCardAsImage(sock);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const result = await shareCard(sock);
    if (result === 'copied') {
      setShareToast('편지 내용이 클립보드에 복사되었어요.');
      setTimeout(() => setShareToast(null), 2500);
    }
  };

  return (
    <div className="view-container letter-result-view">
      <Header title="편지 도착 💌" onBack={onGoToGallery} />

      {shareToast && (
        <div className="toast-notification">
          <span>{shareToast}</span>
        </div>
      )}

      <div className="arrival-congrats-banner">
        <Sparkles className="sparkle-anim" size={20} color="var(--terracotta)" />
        <div className="arrival-text">
          <strong>{sock.name}</strong>(이)가 보낸 마지막 편지가 도착했습니다.
        </div>
      </div>

      {/* MEMORIAL CARD */}
      <div className={`memorial-single-card tone-theme-${sock.tone}`}>
        <div className="card-top-header">
          <DDayBadge dDay={dDay} isReunited={sock.isReunited} tone={sock.tone} />
          <span className="card-site-brand">양말 추모관</span>
        </div>

        <div className="card-sock-visual">
          <div className="card-img-ring">
            <img src={sock.photoUrl} alt={sock.name} className="card-sock-img" />
          </div>
          <h2 className="card-sock-name">{sock.name}</h2>
          <span className="card-sock-meta">
            마지막 위치: {sock.location} · {formatDateKorean(sock.lastSeenDate)} 실종
          </span>
        </div>

        <div className="card-letter-quote-box">
          <div className="quote-mark open">“</div>
          <div className="card-letter-text">
            {sock.letter.split('\n').map((paragraph, index) => (
              <p key={index} className="letter-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="quote-mark close">”</div>
        </div>

        <div className="card-footer-info">
          <span>함께한 시간: {sock.wornSince}</span>
          <span>{sock.tone} 톤</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="card-actions-grid">
        <button
          type="button"
          className="toss-btn toss-btn-primary"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download size={18} />
          <span>{isDownloading ? '저장 중...' : '이미지 저장'}</span>
        </button>

        <button
          type="button"
          className="toss-btn toss-btn-secondary"
          onClick={handleShare}
        >
          <Share2 size={18} />
          <span>공유하기</span>
        </button>
      </div>

      <div className="secondary-navigation-wrap">
        <button
          type="button"
          className="toss-btn toss-btn-ghost full-width"
          onClick={() => onViewDetail(sock)}
        >
          <BookOpen size={18} />
          <span>추모관 상세 & 헌화하기</span>
        </button>

        <button
          type="button"
          className="text-link-btn"
          onClick={onGoToGallery}
        >
          <span>나의 추모관 갤러리 전체 보기</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
