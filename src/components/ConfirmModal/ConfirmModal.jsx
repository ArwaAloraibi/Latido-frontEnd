// ConfirmModal component - a custom confirmation dialog
// Used instead of window.confirm for a better user experience

import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    // Don't close here - let the parent component handle closing after async operations
  };

  const handleCancel = () => {
    onClose();
  };
  
  // Check if confirm button should be disabled (e.g., during deletion)
  const isProcessing = confirmText.includes("...") || confirmText.toLowerCase().includes("deleting");

  return (
    <div 
      className="confirm-modal-overlay" 
      onClick={isProcessing ? undefined : handleCancel}
    >
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title || "Confirm Action"}</h3>
        <p className="confirm-modal-message">{message || "Are you sure you want to proceed?"}</p>
        <div className="confirm-modal-actions">
          <button 
            onClick={handleCancel} 
            className="btn-secondary"
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button 
            onClick={handleConfirm} 
            className="btn-danger"
            disabled={isProcessing}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

