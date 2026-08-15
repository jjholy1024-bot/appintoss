import React, { useState } from 'react';
import { Download, Share2, Heart, Trash2, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Header } from '../common/Header';
import { DDayBadge } from '../common/Badge';
import { SockMemorial } from '../../types/sock';
import { calculateDDay, formatDateKorean } from '../../utils/date';
import { downloadCardAsImage, shareCard } from '../../utils/exportCard';

interface CardDetailViewProps {
  sock: SockMemorial;
  onBack: () => void;
  onUpdateSock: (updated: SockMemorial) => void;
  onDeleteSock: (sockId: string) => void;
}

export const CardDetailView: React.FC<CardDetailViewProps> = ({
  sock,
  onBack,
  onUpdateSock,
  onDeleteSock,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [isBumping, setIsBumping] = useState(false);

  const dDay = calculateDDay(sock.lastSeenDate);
  const is49Day = dDay >= 49 && !sock.isReunited;

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

  const handleAddTribute = () => {
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 300);

    const updated: SockMemorial = {
      ...sock,
      tributeCount: sock.tributeCount + 1,
    };
    onUpdateSock(updated);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.75 },
      colors: ['#B5502E', '#EAE5DA', '#FFFFFF'],
    });
  };

  const handleToggleReunited = () => {
    const nextStatus = !sock.isReunited;
    if (nextStatus) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const updated: SockMemorial = {
      ...sock,
      isReunited: nextStatus,
      reunitedDate: nextStatus ? new Date().toISOString().split('T')[0] : undefined,
    };
    onUpdateSock(updated);
  };

  const handleDelete = () => {
    if (window.confirm(`'${sock.name}' 카드를 추모관에서 보내드릴까요?`)) {
      onDeleteSock(sock.id);
      onBack();
    }
  };

  return (
    <div className="view-container card-detail-view">
      <Header
        title="추모 카드 상세"
        onBack={onBack}
        rightAction={
          <button
            type="button"
            className="header-delete-btn"
            onClick={handleDelete}
            title="추모 카드 삭제"
          >
            <Trash2 size={18} />
          </button>
        }
      />

      {shareToast && (
        <div className="toast-notification">
          <span>{shareToast}</span>
        </div>
      )}

      {/* 49재 또는 재회 알림 배너 */}
      {is49Day && (
        <div className="special-49-notice">
          <span className="incense-icon">🕯️</span>
          <div>
            <strong>실종 49일째 되는 날입니다</strong>
            <p>짝 잃은 양말의 평안을 비는 49재 특별 추모 상태입니다.</p>
          </div>
        </div>
      )}

      {sock.isReunited && (
        <div className="special-reunited-notice">
          <PartyPopper className="party-icon" size={24} />
          <div>
            <strong>기적의 재회 달성! 🎉</strong>
            <p>다시 한 켤레로 짝을 찾았습니다 ({formatDateKorean(sock.reunitedDate || '')}).</p>
          </div>
        </div>
      )}

      {/* CARD CONTAINER */}
      <div className={`detail-card-container ${is49Day ? 'theme-49' : ''} ${sock.isReunited ? 'theme-reunited' : ''}`}>
        <div className="detail-visual-section">
          <div className="detail-img-wrapper">
            <img src={sock.photoUrl} alt={sock.name} className="detail-sock-img" />
          </div>

          <div className="detail-info-block">
            <div className="detail-badge-row">
              <DDayBadge dDay={dDay} isReunited={sock.isReunited} tone={sock.tone} />
            </div>
            <h2 className="detail-sock-title">{sock.name}</h2>

            <div className="detail-metadata-grid">
              <div className="meta-item">
                <span className="meta-label">함께한 기간</span>
                <span className="meta-val">{sock.wornSince}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">실종일</span>
                <span className="meta-val">{formatDateKorean(sock.lastSeenDate)}</span>
              </div>
              <div className="meta-item full-span">
                <span className="meta-label">마지막 위치</span>
                <span className="meta-val">{sock.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TRIBUTE INTERACTION BAR */}
        <div className="tribute-interaction-bar">
          <div className="tribute-count-info">
            <span className="flower-icon">🌼</span>
            <span>국화 헌화 <strong>{sock.tributeCount}송이</strong></span>
          </div>

          <button
            type="button"
            className={`tribute-action-btn ${isBumping ? 'bumping' : ''}`}
            onClick={handleAddTribute}
          >
            <Heart size={14} fill="currentColor" />
            <span>헌화하기</span>
          </button>
        </div>

        {/* SCROLLABLE LETTER BOX */}
        <div className="detail-letter-scroll-box">
          <div className="letter-header-title">
            <span>남긴 편지</span>
            <span className="letter-tone-tag">{sock.tone} 톤</span>
          </div>
          <div className="detail-letter-content">
            {sock.letter.split('\n').map((para, idx) => (
              <p key={idx} className="letter-para">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="detail-actions-section">
        <div className="button-two-row">
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

        {/* 재회 전환 토글 버튼 */}
        <button
          type="button"
          className={`toss-btn ${sock.isReunited ? 'toss-btn-revert' : 'toss-btn-reunite'} full-width`}
          onClick={handleToggleReunited}
        >
          {sock.isReunited ? (
            <span>실종 상태로 되돌리기</span>
          ) : (
            <>
              <PartyPopper size={18} />
              <span>짝을 찾았어요! (재회 카드로 전환)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
