import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ItineraryInfoPage from "../components/ItineraryInfoPage";
import { SessionProvider } from "next-auth/react";
import ModalContext from "../contexts/ModalContext";

// Create a mock google object
global.google = {
  maps: {
    LatLng: function(lat, lng) {
      return { lat: lat, lng: lng };
    },
    LatLngBounds: () => ({
      getSouthWest: () => ({
        lat: () => 40.7128,
        lng: () => -74.0060
      }),
      getNorthEast: () => ({
        lat: () => 40.7128,
        lng: () => -74.0060
      }),
      getCenter: () => ({
        lat: () => 40.7128,
        lng: () => -74.0060
      }),
      extend: jest.fn()
    }),
    MapTypeId: {
      ROADMAP: 'roadmap',
    }
  }
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@react-google-maps/api', () => ({
  ...jest.requireActual('@react-google-maps/api'),
  GoogleMap: jest.fn(() => <div data-testid="mockGoogleMap" />),
  useLoadScript: jest.fn((options) => ({ isLoaded: true }))
}));

describe("ItineraryInfoPage", () => {
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
      id: '1234567890',
    }
  };

  const mockItinerary = {
    name: 'Test Itinerary',
    startingLocation: { lat: 40.7128, lng: -74.0060 },
    startingAddress: 'New York, NY',
    interests: ['museum', 'park', 'restaurant'],
    searchRadius: 10000,
    activities: [
      {
        name: 'Test Activity 1',
        allotedTime: 60,
        place: {
          icon:	"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/park-71.png",
          name:	"Brooklyn Bridge Park",
          geometry: {
            location: {
              lat: 40.7022422,
              lng: -73.9958601
            }
          },
          place_id: "ChIJjaFpo0ZawokRBcOFUZ13CaE",
          rating: 4.8,
          user_ratings_total: 37203
        }
      },
      {
        name: 'Test Activity 2',
        allotedTime: 60,
        description: 'Test description',
        location: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
    ],
    suggestions: [],
    createdDate: '2023-07-09',
    ownerId: '1234567890',
  };

  const mockModalContext = {
    openModal: jest.fn()
  };

  it("renders without crashing", () => {
    const { getByTestId, getAllByTestId, debug } = render(
      <ModalContext.Provider value={mockModalContext}>
        <SessionProvider session={mockSession}>
          <ItineraryInfoPage itinerary={mockItinerary} />
        </SessionProvider>
      </ModalContext.Provider>
    );
    
    debug();
    expect(getByTestId("itinerary-info-page--itinerary-name")).toBeInTheDocument();
    expect(getByTestId("options-button")).toBeInTheDocument();
    expect(getByTestId("itinerary-info-page--map-container")).toBeInTheDocument();
    expect(getByTestId("mockGoogleMap")).toBeInTheDocument();
    expect(getByTestId("itinerary-info-page--directions-button")).toBeInTheDocument();
    expect(getByTestId("itinerary-info-page--activity-list")).toBeInTheDocument();
    const listItems = getAllByTestId("itinerary-info-page--activity-list-item");
    expect(listItems.length).toBe(2);
  });
});