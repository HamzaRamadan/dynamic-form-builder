import  { useEffect } from 'react';
import style from './ClearConfirmation.module.css'
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
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [showSuccess]);

  return (
    <>
      {visible && (
        <div className={style.modal_overlay}>
          <div className={style.modal_content}>
            <h3>{title}</h3>
            <p>{message}</p>
            <div className={style.modal_actions}>

              <button className={`${style.modal_btn} ${style.cancel_btn}`} onClick={onCancel}>
                Cancel
              </button>
              <button className={`${style.modal_btn} ${style.confirm_btn}`} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className={style.success_alert}>
          <div className={style.alert_content}>
            <span className={style.alert_icon}>✓</span>
            <span className={style.alert_message}>{successMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
