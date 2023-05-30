import React, { useState } from 'react';
import ModalContext from '../contexts/ModalContext';

interface ModalProviderProps {
  children: React.ReactNode;
}

interface ModalAction {
  name: string;
  action: () => void;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalActions, setModalActions] = useState<ModalAction[]>([]);
  

  const openModal = (title: string, content: React.ReactNode, actions: ModalAction[]) => {
    setModalTitle(title);
    setModalContent(content);
    setModalActions(actions);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalTitle('');
    setIsModalOpen(false);
    setModalContent(null);
    setModalActions([]);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, modalTitle, modalContent, modalActions, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
