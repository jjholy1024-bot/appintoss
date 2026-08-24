import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DDayBadge } from '../common/Badge';
import { SockMemorial } from '../../types/sock';
import { calculateDDay } from '../../utils/date';
import { computeMemorialStats } from '../../utils/stats';

interface HomeViewProps {
  socks: SockMemorial[];
  onAddNew: () => void;
  onSelectSock: (sock: SockMemorial) => void;
  onViewGallery: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  socks,
  onAddNew,
  onSelectSock,
  onViewGallery,
}) => {
  const { totalCount, reunitedCount, maxMissingDays } = computeMemorialStats(socks);

  const recentSocks = [...socks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="view-container home-view has-tab-bar">
      <div className="home-hero">
        <div className="home-hero-text">
          <h1 className="gallery-main-title">🧦 나의 추모관</h1>
          <span className="home-hero-tagline">잃어버린 한 짝을 위한 디지털 추모 공간</span>
        </div>
      </div>

      <div className="home-stats-row">
        <div className="home-stat-box">
          <span className="home-stat-value">{totalCount}</span>
          <span className="home-stat-label">총 추모</span>
        </div>
        <div className="home-stat-divider" />
        <div className="home-stat-box">
          <span className="home-stat-value highlight">{maxMissingDays}일</span>
          <span className="home-stat-label">최장 미제</span>
        </div>
        <div className="home-stat-divider" />
        <div className="home-stat-box">
          <span className="home-stat-value">{reunitedCount}</span>
          <span className="home-stat-label">재회</span>
        </div>
      </div>

      <div className="home-cta-card">
        <span className="home-cta-icon">🕯️</span>
        <p className="home-cta-text">
          짝을 잃은 양말이 있나요?
          <br />
          사진 한 장이면 이별 편지를 써드릴게요.
        </p>
        <button type="button" className="home-cta-btn" onClick={onAddNew}>
          <span>새로 추모하기</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="home-recent-header">
        <h2 className="home-section-title">최근 추모</h2>
        {socks.length > 0 && (
          <button type="button" className="text-link-btn home-viewall-btn" onClick={onViewGallery}>
            <span>전체보기</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {recentSocks.length === 0 ? (
        <div className="empty-gallery-state">
          <p className="empty-title">아직 추모한 양말이 없어요</p>
          <p className="empty-desc">사진 한 장으로 첫 추모를 시작해보세요.</p>
        </div>
      ) : (
        <div className="home-recent-scroll">
          {recentSocks.map((sock) => {
            const dDay = calculateDDay(sock.lastSeenDate);
            return (
              <div
                key={sock.id}
                className="home-recent-card"
                onClick={() => onSelectSock(sock)}
              >
                <div className="home-recent-thumb-wrap">
                  <img src={sock.photoUrl} alt={sock.name} className="home-recent-thumb" />
                </div>
                <DDayBadge dDay={dDay} isReunited={sock.isReunited} compact />
                <div className="home-recent-name">{sock.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
