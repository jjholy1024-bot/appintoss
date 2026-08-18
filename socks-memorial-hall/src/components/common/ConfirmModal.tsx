import React from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 토스 앱 웹뷰에서는 window.confirm 같은 네이티브 브라우저 다이얼로그가
 * 지원되지 않을 수 있어서, 직접 그리는 확인 모달이에요.
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button type="button" className="toss-btn toss-btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="toss-btn toss-btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
