import React, { useContext } from 'react';
import ModalContext from '../contexts/ModalContext';
import styles from "../styles/Modal.module.scss";

const Modal: React.FC = () => {
  const modalContext = useContext(ModalContext);

  if (!modalContext?.isModalOpen) return null;

  const { closeModal, modalContent } = modalContext;

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.closeButtonContainer}>
          <img 
            className={styles.closeButton} 
            src="/images/close.png" 
            alt="Close modal"
            onClick={closeModal}
          />
        </div>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          {modalContent}
        </div>
      </div>
    </div>
  );
};

export default Modal;
