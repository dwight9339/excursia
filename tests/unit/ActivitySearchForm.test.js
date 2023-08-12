import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ActivitySearchForm from '../../components/ActivitySearch/ActivitySearchForm';
import { SessionProvider } from 'next-auth/react';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

// Mock the useLoadScript hook
jest.mock('@react-google-maps/api', () => ({
  useLoadScript: jest.fn(),
  GoogleMap: ({ children }) => <div>{children}</div>,
  CircleF: () => <div />
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
    MapTypeId: {
      ROADMAP: 'roadmap',
    },
  },
};

describe('ActivitySearchForm', () => {
  const mockUpdateItinerary = jest.fn();
  const defaultItinerary = {
    name: "New Itinerary",
    startingLocation: { lat: 38.764972, lng: -95.889472 },
    startingAddress: "",
    interests: [],
    searchRadius: 16093.4,
    activities: [],
    suggestions: [],
    createdDate: new Date().toISOString(),
    ownerId: "1234567890"
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
    }
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

  it("renders all sections without crashing", () => {
    const { getByTestId } = render(
      <SessionProvider 
        session={mockSession}
      >
        <ActivitySearchForm itinerary={defaultItinerary} updateItinerary={mockUpdateItinerary} />
      </SessionProvider>
    );

    expect(getByTestId("activity-search-form--container")).toBeInTheDocument();
    expect(getByTestId("activity-search-form--form")).toBeInTheDocument();
    expect(getByTestId("activity-search-form--location-search-container")).toBeInTheDocument();
    expect(getByTestId("activity-search-form--search-radius-slider-container")).toBeInTheDocument();
    expect(getByTestId("activity-search-form--map-container")).toBeInTheDocument();
    expect(getByTestId("activity-search-form--interest-select-container")).toBeInTheDocument();
  });

  it("renders location search bar", () => {
    const { getByTestId } = render(
      <SessionProvider
        session={mockSession}
      >
        <ActivitySearchForm itinerary={defaultItinerary} updateItinerary={mockUpdateItinerary} />
      </SessionProvider>
    );

    expect(getByTestId("location-search--input")).toBeInTheDocument();
  });

  it("updates search radius when search radius slider is moved", () => {
    const { getByText, getByRole } = render(
      <SessionProvider 
        session={mockSession}
      >
        <ActivitySearchForm 
          itinerary={defaultItinerary}
          updateItinerary={mockUpdateItinerary}
        />
      </SessionProvider>
    );

    expect(getByText("Search Radius: 10 miles")).toBeInTheDocument();
    
    const slider = getByRole('slider');
    expect(slider).not.toBeDisabled();

    fireEvent.change(slider, { target: { value: 40233 } });
    expect(mockUpdateItinerary).toHaveBeenCalled();
  });

  it("disables search radius slider when location is not selected", () => {
    const { getByText, getByRole } = render(
      <SessionProvider
        session={mockSession}
      >
        <ActivitySearchForm
          itinerary={defaultItinerary}
          updateItinerary={mockUpdateItinerary}
          isDraft={true}
        />
      </SessionProvider>
    );

    const slider = getByRole('slider');
    expect(slider).toBeDisabled();
  });

  it("enables search radius slider when location is selected", async () => {
    const { getByText, getByTestId, findByTestId, getByRole } = render(
      <SessionProvider
        session={mockSession}
      >
        <ActivitySearchForm
          itinerary={defaultItinerary}
          updateItinerary={mockUpdateItinerary}
          isDraft={true}
        />
      </SessionProvider>
    );

    const slider = getByRole('slider');
    expect(slider).toBeDisabled();

    const locationInput = getByTestId("location-search--input");
    fireEvent.change(locationInput, { target: { value: "Test Location" } });
    fireEvent.click(await findByTestId("location-search--suggestion-0"));
    await waitFor(() => expect(slider).not.toBeDisabled());
  });
});
