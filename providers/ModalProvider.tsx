import React, { useState } from 'react';
import ModalContext from '../contexts/ModalContext';

interface ModalProviderProps {
  children: React.ReactNode;
}

interface ModalOption {
  name: string;
  action: () => void;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalOptions, setModalOptions] = useState<ModalOption[]>([]);
  

  const openModal = (content: React.ReactNode, options: ModalOption[]) => {
    setModalContent(content);
    setModalOptions(options);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalOptions([]);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, modalContent, modalOptions, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
