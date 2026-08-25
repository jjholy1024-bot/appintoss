import React, { useState } from 'react';
import { Download, Share2, Flower2, Trash2, PartyPopper, Sparkles, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Header } from '../common/Header';
import { DDayBadge } from '../common/Badge';
import { SockMemorial } from '../../types/sock';
import { calculateDDay, formatDateKorean } from '../../utils/date';
import { downloadCardAsImage, shareCard } from '../../utils/exportCard';
import { generateAddendum } from '../../utils/letterGenerator';
import { publishSharedSock } from '../../utils/api';
import { useFlowerPop, FlowerPopLayer, WhiteChrysanthemum } from '../common/FlowerPop';
import { ConfirmModal } from '../common/ConfirmModal';

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
  const [isAddingAddendum, setIsAddingAddendum] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showReunionAnim, setShowReunionAnim] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { pops, triggerFlowerPop } = useFlowerPop();

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
    triggerFlowerPop();

    const updated: SockMemorial = {
      ...sock,
      tributeCount: sock.tributeCount + 1,
    };
    onUpdateSock(updated);
  };

  const handleToggleReunited = async () => {
    const nextStatus = !sock.isReunited;

    if (nextStatus) {
      setShowReunionAnim(true);
      setTimeout(() => setShowReunionAnim(false), 1600);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    if (nextStatus && !sock.hasReunionAddendum) {
      setIsAddingAddendum(true);
      const addendum = await generateAddendum('reunited', {
        name: sock.name,
        wornSince: sock.wornSince,
        lastSeenDate: sock.lastSeenDate,
        location: sock.location,
        tone: sock.tone,
        previousLetter: sock.letter,
      });
      setIsAddingAddendum(false);

      onUpdateSock({
        ...sock,
        isReunited: true,
        reunitedDate: new Date().toISOString().split('T')[0],
        letter: addendum ? `${sock.letter}\n\n${addendum}` : sock.letter,
        hasReunionAddendum: !!addendum,
        reunionAddendumText: addendum ?? undefined,
      });
      return;
    }

    if (!nextStatus && sock.hasReunionAddendum && sock.reunionAddendumText) {
      onUpdateSock({
        ...sock,
        isReunited: false,
        reunitedDate: undefined,
        letter: sock.letter.replace(`\n\n${sock.reunionAddendumText}`, ''),
        hasReunionAddendum: false,
        reunionAddendumText: undefined,
      });
      return;
    }

    onUpdateSock({
      ...sock,
      isReunited: nextStatus,
      reunitedDate: nextStatus ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  const handleGenerate49Addendum = async () => {
    setIsAddingAddendum(true);
    const addendum = await generateAddendum('49days', {
      name: sock.name,
      wornSince: sock.wornSince,
      lastSeenDate: sock.lastSeenDate,
      location: sock.location,
      tone: sock.tone,
      previousLetter: sock.letter,
    });
    setIsAddingAddendum(false);

    if (addendum) {
      onUpdateSock({
        ...sock,
        letter: `${sock.letter}\n\n${addendum}`,
        has49Addendum: true,
      });
    }
  };

  const handleShareWithFriends = async () => {
    setIsPublishing(true);
    try {
      await publishSharedSock(sock.id, sock);
      const link = `${window.location.origin}${window.location.pathname}?shared=${sock.id}`;
      await navigator.clipboard.writeText(link);
      setShareToast('친구 초대 링크가 복사됐어요! 붙여넣기로 공유해보세요.');
      setTimeout(() => setShareToast(null), 3000);
      onUpdateSock({ ...sock, isShared: true });
    } catch {
      setShareToast('공유 링크 생성에 실패했어요. 잠시 후 다시 시도해주세요.');
      setTimeout(() => setShareToast(null), 3000);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDeleteSock(sock.id);
    onBack();
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

      {showDeleteConfirm && (
        <ConfirmModal
          title="추모 카드 삭제"
          message={`'${sock.name}' 카드를 추모관에서 보내드릴까요?`}
          confirmLabel="삭제"
          cancelLabel="취소"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showReunionAnim && (
        <div className="reunion-anim-overlay">
          <div className="reunion-sock reunion-sock-left">
            <img src={sock.photoUrl} alt={sock.name} />
          </div>
          <div className="reunion-sock reunion-sock-right">🧦</div>
          <div className="reunion-spark-burst">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <span
                key={angle}
                className="reunion-spark"
                style={{ '--angle': `${angle}deg` } as React.CSSProperties}
              >
                {angle % 90 === 0 ? '✨' : '💕'}
              </span>
            ))}
          </div>
          <div className="reunion-anim-text">짝을 찾았어요! 🎉</div>
        </div>
      )}

      {/* 49재 또는 재회 알림 배너 */}
      {is49Day && (
        <div className="special-49-notice">
          <span className="incense-icon">🕯️</span>
          <div style={{ flex: 1 }}>
            <strong>실종 49일째 되는 날입니다</strong>
            <p>짝 잃은 양말의 평안을 비는 49재 특별 추모 상태입니다.</p>
            {!sock.has49Addendum && (
              <button
                type="button"
                className="text-link-btn"
                style={{ padding: '6px 0', color: 'var(--terracotta)' }}
                onClick={handleGenerate49Addendum}
                disabled={isAddingAddendum}
              >
                <Sparkles size={14} />
                <span>{isAddingAddendum ? '작성 중...' : '49재 편지 추가로 받기'}</span>
              </button>
            )}
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
          <div className={`detail-img-wrapper ${is49Day ? 'floating-49' : ''}`}>
            <img src={sock.photoUrl} alt={sock.name} className="detail-sock-img" />
            {is49Day && <span className="cloud-peek">☁️</span>}
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

          <div className="tribute-btn-wrap">
            <FlowerPopLayer pops={pops} />
            <button
              type="button"
              className={`tribute-action-btn ${isBumping ? 'bumping' : ''}`}
              onClick={handleAddTribute}
            >
              <Flower2 size={14} />
              <span>헌화하기</span>
            </button>
          </div>
        </div>

        {/* 친구 초대 & 헌화 공유 */}
        <button
          type="button"
          className="toss-btn-ghost toss-btn full-width"
          style={{ marginBottom: 18 }}
          onClick={handleShareWithFriends}
          disabled={isPublishing}
        >
          <Users size={16} />
          <span>
            {isPublishing
              ? '초대 링크 만드는 중...'
              : sock.isShared
              ? '친구 초대 링크 다시 복사하기'
              : '친구 초대해서 같이 헌화하기'}
          </span>
        </button>

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
          disabled={isAddingAddendum}
        >
          {isAddingAddendum ? (
            <span>재회 편지 쓰는 중...</span>
          ) : sock.isReunited ? (
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
