import { render, screen, fireEvent } from '@testing-library/react';
import ModalContext from '../contexts/ModalContext';
import Modal from '../components/Modal';
import { createContext } from 'react';

describe('Modal', () => {
  const mockCloseModal = jest.fn();

  const mockModalContext = {
    isModalOpen: true,
    closeModal: mockCloseModal,
    modalTitle: 'Test Modal Title',
    modalContent: 'Test Modal Content',
    modalActions: [
      { name: 'Action 1', action: jest.fn() },
      { name: 'Action 2', action: jest.fn() },
    ],
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <ModalContext.Provider value={mockModalContext}>
        <Modal />
      </ModalContext.Provider>
    );
    
    expect(getByText(mockModalContext.modalTitle)).toBeInTheDocument();
    expect(getByText(mockModalContext.modalContent)).toBeInTheDocument();
    mockModalContext.modalActions.forEach(action => {
      expect(getByText(action.name)).toBeInTheDocument();
    });
  });

  it('does not render anything when isModalOpen is false', () => {
    const { queryByTestId, queryByText } = render(
      <ModalContext.Provider value={{ ...mockModalContext, isModalOpen: false }}>
        <Modal />
      </ModalContext.Provider>
    );

    expect(queryByTestId("modal-container")).toBeNull();
    expect(queryByTestId("modal-window")).toBeNull();
    expect(queryByText(mockModalContext.modalTitle)).toBeNull();
    expect(queryByText(mockModalContext.modalContent)).toBeNull();
    mockModalContext.modalActions.forEach(action => {
      expect(queryByText(action.name)).toBeNull();
    });
  });

  it('calls closeModal when the close button is clicked', () => {
    const { getByTestId } = render(
      <ModalContext.Provider value={mockModalContext}>
        <Modal />
      </ModalContext.Provider>
    );

    fireEvent.click(getByTestId("modal-close-button"));
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
