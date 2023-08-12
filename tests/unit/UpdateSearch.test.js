import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UpdateSearch from '../../components/ActivitySearch/UpdateSearch';
import { useRouter } from 'next/router';
import { useLoadScript } from '@react-google-maps/api';
import { SessionProvider, useSession } from 'next-auth/react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import ModalContext from '../../contexts/ModalContext';
import Modal from '../../components/Modal';

jest.mock('@react-google-maps/api', () => ({
  useLoadScript: jest.fn(),
  GoogleMap: ({ children }) => <div>{children}</div>,
  CircleF: () => <div />
}));

jest.mock('use-places-autocomplete', () => ({
  __esModule: true,
  default: jest.fn(),
  getGeocode: jest.fn(),
  getLatLng: jest.fn()
}));

global.google = {
  maps: {
    LatLng: function(lat, lng) {
      return { lat: lat, lng: lng };
    },
    MapTypeId: {
      ROADMAP: 'roadmap',
    },
  },
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('UpdateSearch', () => {
  // Mock ModalContext
  const mockCloseModal = jest.fn();

  const mockModalContext = {
    isModalOpen: true,
    closeModal: mockCloseModal,
    modalTitle: 'Test Modal Title',
    modalContent: <UpdateSearch />,
    modalActions: []
  };
  const mockSession = {
    user: {
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      email: 'john.doe@example.com',
      preferences: {
        language: 'english',
        distanceUnit: 'miles'
      },
      id: 12345
    }
  }
  let mockLocationInputValue = "";

  beforeEach(() => {
    mockLocationInputValue = "";
    // Setup the useLoadScript hook to return isLoaded: true
    useLoadScript.mockReturnValue({
      isLoaded: true,
      loadError: null,
    });

    // Setup the usePlacesAutocomplete hook to return some mock data
    usePlacesAutocomplete.mockReturnValue({
      ready: true,
      value: mockLocationInputValue,
      suggestions: { status: 'OK', data: [
        {
          name: 'Test Suggestion 1',
          geometry: {
            location: {
              lat: 50.79,
              lng: -85.07,
            },
          },
        },
        {
          name: 'Test Suggestion 2',
          geometry: {
            location: {
              lat: 40.7128,
              lng: -74.0060,
            },
          },
        },
      ] },
      setValue: jest.fn(),
      clearSuggestions: jest.fn()
    });

    getGeocode.mockImplementation(() => Promise.resolve([{
      geometry: {
        location: {
          lat: () => 50.79,
          lng: () => -85.07,
        },
      },
    }]));
  
    getLatLng.mockImplementation(() => Promise.resolve({ lat: 50.79, lng: -85.07 }));
  });

  it ('renders without crashing', () => {
    const { getByTestId } = render(
      <SessionProvider session={mockSession}>
        <ModalContext.Provider value={mockModalContext}>
          <Modal />
        </ModalContext.Provider>
      </SessionProvider>
    );

    expect(getByTestId("update-search--activity-search-container")).toBeInTheDocument();
    expect(getByTestId("update-search--footer")).toBeInTheDocument();
    expect(getByTestId("update-search--update-button")).toBeInTheDocument();
    expect(getByTestId("update-search--cancel-button")).toBeInTheDocument();
  });

  it ("calls fetch when update button is clicked", () => {
    const { getByTestId } = render(
      <SessionProvider session={mockSession}>
        <ModalContext.Provider value={mockModalContext}>
          <Modal />
        </ModalContext.Provider>
      </SessionProvider>
    );

    fireEvent.click(getByTestId("update-search--update-button"));

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it ("calls closeModal when cancel button is clicked", () => {
    const { getByTestId } = render(
      <SessionProvider session={mockSession}>
        <ModalContext.Provider value={mockModalContext}>
          <Modal />
        </ModalContext.Provider>
      </SessionProvider>
    );

    fireEvent.click(getByTestId("update-search--cancel-button"));

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});