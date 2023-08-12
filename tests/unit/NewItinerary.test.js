import { render, fireEvent, waitFor } from '@testing-library/react';
import NewItinerary from '../../components/ActivitySearch/NewItinerary';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

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

describe('NewItinerary', () => {
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

  it("renders all sections without crashing", () => {
    const { getByTestId, debug } = render(
      <SessionProvider session={mockSession}>
        <NewItinerary />
      </SessionProvider>
    );

    expect(getByTestId("new-itinerary--container")).toBeInTheDocument();
    expect(getByTestId("new-itinerary--header")).toBeInTheDocument();
    expect(getByTestId("new-itinerary--form")).toBeInTheDocument();
    expect(getByTestId("new-itinerary--footer")).toBeInTheDocument();
  });

  it("prevents form submission when no location is selected", () => {
    const { getByTestId } = render(
      <SessionProvider session={mockSession}>
        <NewItinerary />
      </SessionProvider>
    );

    const submitButton = getByTestId("new-itinerary--submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("enables form submission when a location is selected", async () => {
    const { getByTestId, findByTestId, debug } = render(
      <SessionProvider session={mockSession}>
        <NewItinerary />
      </SessionProvider>
    );

    const searchBar = getByTestId("location-search--input");
    fireEvent.change(searchBar, { target: { value: 'Test Suggestion 1' } });
    fireEvent.click(getByTestId("location-search--suggestion-0"));
    const submitButton = await findByTestId("new-itinerary--submit-button");
    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it("makes a POST request to the API when the form is submitted", async () => {
    const { getByTestId, findByTestId, debug } = render(
      <SessionProvider session={mockSession}>
        <NewItinerary />
      </SessionProvider>
    );

    const searchBar = getByTestId("location-search--input");
    fireEvent.change(searchBar, { target: { value: 'Test Suggestion 1' } });
    fireEvent.click(getByTestId("location-search--suggestion-0"));
    const submitButton = await findByTestId("new-itinerary--submit-button");
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });
});