import  { useEffect } from 'react';

interface ClearConfirmationProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  showSuccess?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  successMessage?: string;
}

export default function ClearConfirmation({
  visible,
  onCancel,
  onConfirm,
  showSuccess = false,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  successMessage = 'Action completed successfully!'
}: ClearConfirmationProps) {
  useEffect(() => {
    let timeout: number;

    if (showSuccess) {
      timeout = window.setTimeout(() => {
        // auto-hide logic if needed
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [showSuccess]);

  return (
    <>
      {visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={onCancel}>
                Cancel
              </button>
              <button className="modal-btn confirm-btn" onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-alert">
          <div className="alert-content">
            <span className="alert-icon">✓</span>
            <span className="alert-message">{successMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
