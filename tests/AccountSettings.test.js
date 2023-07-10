import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import AccountSettings from '../components/AccountSettings';
import ModalContext from '../contexts/ModalContext';
import Modal from '../components/Modal';

jest.mock('axios');
jest.mock('next-auth/react');
jest.mock('../contexts/ModalContext');

describe('AccountSettings', () => {
  // Mock session data
  const mockSession = {
    user: {
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      email: 'john.doe@example.com',
      preferences: {
        language: 'english',
        distanceUnit: 'metric',
      },
    },
  };

  // Mock axios
  axios.post.mockResolvedValue({ status: 200 });

  // Mock useSession
  useSession.mockReturnValue({
    data: mockSession,
    update: jest.fn(),
  });

  // Mock ModalContext
  const mockCloseModal = jest.fn();

  const mockModalContext = {
    isModalOpen: true,
    closeModal: mockCloseModal,
    modalTitle: 'Test Modal Title',
    modalContent: <AccountSettings />,
    modalActions: []
  };

  it('renders the form fields correctly', () => {
    const { getByText, getByLabelText } = render(
      <ModalContext.Provider value={mockModalContext}>
        <Modal />
      </ModalContext.Provider>
    );

    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByLabelText('Language:')).toBeInTheDocument();
    expect(getByLabelText('Distance measurement:')).toBeInTheDocument();
  });

  it('renders the correct values in the form fields', () => {
    const { getByText, getByLabelText } = render(
      <ModalContext.Provider value={mockModalContext}>
        <Modal />
      </ModalContext.Provider>
    );
    
    expect(getByText("John")).toBeInTheDocument();
    expect(getByText("Doe")).toBeInTheDocument();
    expect(getByText(mockSession.user.email)).toBeInTheDocument();
    expect(getByLabelText("Language:")).toHaveValue(mockSession.user.preferences.language);
    expect(getByLabelText("Distance measurement:")).toHaveValue(mockSession.user.preferences.distanceUnit);
  });

  it('updates the state when a field is changed', () => {
    const { getByLabelText } = render(
      <ModalContext.Provider value={mockModalContext}>
        <Modal />
      </ModalContext.Provider>
    );

    // Edit the language and distance measurement fields
    fireEvent.change(getByLabelText('Language:'), { target: { value: 'spanish' } });
    fireEvent.change(getByLabelText('Distance measurement:'), { target: { value: 'miles' } });

    expect(getByLabelText('Language:').value).toBe('spanish');
    expect(getByLabelText('Distance measurement:').value).toBe('miles');
  });

  it('sends a POST request with the correct data when the submit button is clicked', async () => {
    const { getByText, getByLabelText } = render(
      <ModalContext.Provider value={mockModalContext}>
        <Modal />
      </ModalContext.Provider>
    );

    fireEvent.change(getByLabelText('Language:'), { target: { value: 'spanish' } });
    fireEvent.change(getByLabelText('Distance measurement:'), { target: { value: 'miles' } });

    fireEvent.click(getByText('Save'));

    expect(axios.post).toHaveBeenCalledWith('/api/update-user', {
      userId: mockSession.user.id,
      userInfo: {
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        email: 'john.doe@example.com',
        preferences: {
          language: 'spanish',
          distanceUnit: 'miles',
        },
      },
    });
  });

  it("updates the user's session and closes the modal when the request is successful", async () => {
    const { getByText, getByLabelText } = render(
      <ModalContext.Provider value={mockModalContext}>
        <Modal />
      </ModalContext.Provider>
    );

    fireEvent.change(getByLabelText('Language:'), { target: { value: 'spanish' } });
    fireEvent.change(getByLabelText('Distance measurement:'), { target: { value: 'miles' } });

    fireEvent.click(getByText('Save'));

    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for promises to resolve

    expect(useSession().update).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
