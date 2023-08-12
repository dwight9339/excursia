import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AddActivity from '../../components/EditPage/AddActivity';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import ModalContext from '../../contexts/ModalContext';

const mockModalContext = {
  closeModal: jest.fn()
};

// Mock the useLoadScript hook
jest.mock('@react-google-maps/api', () => ({
  useLoadScript: jest.fn(),
}));

// Mock the usePlacesAutocomplete hook
jest.mock('use-places-autocomplete', () => ({
  __esModule: true,
  default: jest.fn(),
  getGeocode: jest.fn(),
  getLatLng: jest.fn()
}));

// Create a mock google object
global.google = {
  maps: {
    LatLng: function(lat, lng) {
      return { lat: lat, lng: lng };
    },
  },
};

describe('AddActivity', () => {
  const mockOnSubmit = jest.fn();
  const mockItinerary = {
    id: '1',
    name: 'Test Itinerary',
    startingLocation: { lat: 40.7128, lng: -74.0060 },
    startingAddress: 'New York, NY',
    interests: ['museum', 'park', 'restaurant'],
    searchRadius: 10000,
    activities: [
      {
        id: '1',
        name: 'Test Activity 1',
        location: { lat: 40.7128, lng: -74.0060 },
        address: '123 Test St, New York, NY',
        startTime: '10:00',
        endTime: '12:00',
        notes: 'Test notes for activity 1',
      },
      {
        id: '2',
        name: 'Test Activity 2',
        location: { lat: 40.7128, lng: -74.0060 },
        address: '456 Test St, New York, NY',
        startTime: '13:00',
        endTime: '15:00',
        notes: 'Test notes for activity 2',
      },
    ],
    suggestions: [],
    createdDate: '2023-07-09',
    ownerId: '1',
  };
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
      setValue: (value) => { mockLocationInputValue = value; },
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

  it('renders correctly', () => {
    const { getByTestId } = render(
      <ModalContext.Provider value={mockModalContext}>
        <AddActivity
          itinerary={{}}
          onSubmit={mockOnSubmit}
        />
      </ModalContext.Provider>
    );

    expect(getByTestId('add-activity--form-container')).toBeInTheDocument();
    expect(getByTestId('add-activity--name-field-container')).toBeInTheDocument();
    expect(getByTestId('add-activity--name-field')).toBeInTheDocument();
    expect(getByTestId('add-activity--location-field-container')).toBeInTheDocument();
    expect(getByTestId('add-activity--submit-button')).toBeInTheDocument();
  });

  it("disables the submit button when the form is invalid", () => {
    const { getByTestId } = render(
      <ModalContext.Provider value={mockModalContext}>
        <AddActivity
          itinerary={{}}
          onSubmit={mockOnSubmit}
        />
      </ModalContext.Provider>
    );

    expect(getByTestId('add-activity--submit-button')).toBeDisabled();
  });

  it("enables the submit button when the form is valid", async () => {
    const { getByTestId, findByTestId, debug } = render(
      <ModalContext.Provider value={mockModalContext}>
        <AddActivity
          itinerary={{}}
          onSubmit={mockOnSubmit}
        />
      </ModalContext.Provider>
    );

    // Fill in the form
    const nameField = getByTestId("add-activity--name-field");
    const locationField = getByTestId("location-search--input");
    fireEvent.change(nameField, { target: { value: "Test Activity" } });
    fireEvent.change(locationField, { target: { value: "Test" } });
    fireEvent.click(await findByTestId("location-search--suggestion-0"));

    await waitFor(() => expect(getByTestId('add-activity--submit-button')).toBeEnabled());
  });

  it('submits the form correctly', async () => {
    const { getByTestId, findByTestId } = render(
      <ModalContext.Provider value={mockModalContext}>
        <AddActivity
          itinerary={{}}
          onSubmit={mockOnSubmit}
        />
      </ModalContext.Provider>
    );

    // Fill in the form
    const nameField = getByTestId("add-activity--name-field");
    const locationField = getByTestId("location-search--input");
    fireEvent.change(nameField, { target: { value: "Test Activity" } });
    fireEvent.change(locationField, { target: { value: "Test" } });
    fireEvent.click(await findByTestId("location-search--suggestion-0"));

    // Submit the form
    await waitFor(() => expect(getByTestId('add-activity--submit-button')).toBeEnabled());
    fireEvent.click(getByTestId("add-activity--submit-button"));

    // Check if the onSubmit function was called with the correct values
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1));
  });
});