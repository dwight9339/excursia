import React from 'react';

interface IModalContext {
  isModalOpen: boolean;
  modalContent: React.ReactNode;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = React.createContext<IModalContext | undefined>(undefined);

export default ModalContext;
