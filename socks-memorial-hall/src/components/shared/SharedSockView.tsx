import React, { useEffect, useState } from 'react';
import { Flower2, Loader } from 'lucide-react';
import { DDayBadge } from '../common/Badge';
import { SockMemorial } from '../../types/sock';
import { calculateDDay, formatDateKorean } from '../../utils/date';
import { fetchSharedSock, addSharedTribute } from '../../utils/api';
import { useFlowerPop, FlowerPopLayer } from '../common/FlowerPop';

interface SharedSockViewProps {
  sockId: string;
  onClose: () => void;
}

export const SharedSockView: React.FC<SharedSockViewProps> = ({ sockId, onClose }) => {
  const [sock, setSock] = useState<SockMemorial | null>(null);
  const [tributeCount, setTributeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBumping, setIsBumping] = useState(false);
  const { pops, triggerFlowerPop } = useFlowerPop();

  useEffect(() => {
    fetchSharedSock(sockId)
      .then(({ sock, tributeCount }) => {
        setSock(sock);
        setTributeCount(tributeCount);
      })
      .catch(() => setError('공유된 추모 카드를 찾을 수 없어요. 링크가 만료되었을 수 있어요.'))
      .finally(() => setIsLoading(false));
  }, [sockId]);

  const handleTribute = async () => {
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 300);
    triggerFlowerPop();
    try {
      const newCount = await addSharedTribute(sockId);
      setTributeCount(newCount);
    } catch {
      // 조용히 실패 — 헌화 하나 실패했다고 유저를 방해할 필요는 없음
    }
  };

  if (isLoading) {
    return (
      <div className="view-container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader className="spin" size={28} />
        <p style={{ marginTop: 12, color: 'var(--greige-brown)', fontSize: 13 }}>친구의 추모관을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !sock) {
    return (
      <div className="view-container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <p className="empty-title">{error}</p>
        <button type="button" className="toss-btn toss-btn-secondary" style={{ marginTop: 16 }} onClick={onClose}>
          내 추모관으로 가기
        </button>
      </div>
    );
  }

  const dDay = calculateDDay(sock.lastSeenDate);

  return (
    <div className="view-container">
      <div className="upload-intro-banner">
        <span className="step-tag">친구가 공유한 추모 카드</span>
        <p className="intro-text">'{sock.name}'의 이별을 함께 애도해주세요 🕯️</p>
      </div>

      <div className="detail-card-container">
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
            </div>
          </div>
        </div>

        <div className="tribute-interaction-bar">
          <div className="tribute-count-info">
            <span className="flower-icon">🌼</span>
            <span>국화 헌화 <strong>{tributeCount}송이</strong></span>
          </div>
          <div className="tribute-btn-wrap">
            <FlowerPopLayer pops={pops} />
            <button
              type="button"
              className={`tribute-action-btn ${isBumping ? 'bumping' : ''}`}
              onClick={handleTribute}
            >
              <Flower2 size={14} />
              <span>헌화하기</span>
            </button>
          </div>
        </div>

        <div className="detail-letter-scroll-box">
          <div className="letter-header-title">
            <span>남긴 편지</span>
            <span className="letter-tone-tag">{sock.tone} 톤</span>
          </div>
          <div className="detail-letter-content">
            {sock.letter.split('\n').map((para, idx) => (
              <p key={idx} className="letter-para">{para}</p>
            ))}
          </div>
        </div>
      </div>

      <button type="button" className="toss-btn toss-btn-secondary full-width" onClick={onClose}>
        나도 양말 추모관 만들어보기
      </button>
    </div>
  );
};