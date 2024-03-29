import { render, fireEvent, waitFor } from '@testing-library/react';
import LocationSearch from '../../components/LocationSearch';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

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

describe('LocationSearch', () => {
  const mockOnSelectLocation = jest.fn();
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

  beforeEach(() => {
    // Setup the useLoadScript hook to return isLoaded: true
    useLoadScript.mockReturnValue({
      isLoaded: true,
      loadError: null,
    });

    // Setup the usePlacesAutocomplete hook to return some mock data
    usePlacesAutocomplete.mockReturnValue({
      ready: true,
      value: '',
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

  it('renders correctly', async () => {
    const { findByTestId } = render(
      <LocationSearch onSelectLocation={mockOnSelectLocation} itinerary={mockItinerary} />
    );

    const searchBar = await findByTestId("location-search--input");
    expect(searchBar).toBeInTheDocument();
  });

  it("updates the search bar value when text is entered", async () => {
    const { getByTestId, debug } = render(
      <LocationSearch onSelectLocation={mockOnSelectLocation} itinerary={mockItinerary} />
    );

    const searchBar = getByTestId("location-search--input");
    fireEvent.change(searchBar, { target: { value: 'Test' } });
    expect(usePlacesAutocomplete().setValue).toHaveBeenCalledWith("Test");
  });

  it("calls onSelectLocation when a location is selected", async () => {
    const { getByTestId, findByTestId, debug } = render(
      <LocationSearch onSelectLocation={mockOnSelectLocation} itinerary={mockItinerary} />
    );

    const searchBar = getByTestId("location-search--input");
    fireEvent.change(searchBar, { target: { value: 'Test' } });
    fireEvent.click(await findByTestId("location-search--suggestion-1"));
    await waitFor(() => expect(mockOnSelectLocation).toHaveBeenCalledTimes(1));
  });
});
