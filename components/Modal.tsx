import React, { useContext } from 'react';
import ModalContext from '../contexts/ModalContext';
import styles from "../styles/Modal.module.scss";

const Modal: React.FC = () => {
  const modalContext = useContext(ModalContext);

  if (!modalContext?.isModalOpen) return null;

  const { closeModal, modalTitle, modalContent, modalActions } = modalContext;

  return (
    <div className={styles.container} data-testid="modal-container">
      <div className={styles.modal} data-testid="modal-window">
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>{modalTitle}</div>
          <img 
            className={styles.closeButton} 
            src="/images/close.png" 
            alt="Close modal"
            data-testid="modal-close-button"
            onClick={closeModal}
          />
        </div>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          {modalContent}
        </div>
        <div className={styles.modalFooter}>
          {modalActions?.map((action: any, index: number) => (
            <div
              key={index}
              className={styles.action}
              onClick={action.action}
            >
              {action.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
