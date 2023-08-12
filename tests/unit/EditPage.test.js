import React from "react";
import { render, fireEvent } from "@testing-library/react";
import EditPage from "../../components/EditPage";
import { SessionProvider } from "next-auth/react";
import ModalContext from "../../contexts/ModalContext";

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe("EditPage", () => {
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
    const { getByTestId } = render(
      <ModalContext.Provider value={mockModalContext}>
        <SessionProvider session={mockSession}>
          <EditPage itinerary={mockItinerary} />
        </SessionProvider>
      </ModalContext.Provider>
    );
    
    expect(getByTestId("edit-page--title-container")).toBeInTheDocument();
    expect(getByTestId("edit-page--map-container")).toBeInTheDocument();
    expect(getByTestId("edit-page--selected-activities-container")).toBeInTheDocument();
    expect(getByTestId("edit-page--add-custom-button-container")).toBeInTheDocument();
    expect(getByTestId("edit-page--add-custom-button")).toBeInTheDocument();
    expect(getByTestId("edit-page--suggested-activities-container")).toBeInTheDocument();
    expect(getByTestId("edit-page--update-search-button-container")).toBeInTheDocument();
    expect(getByTestId("edit-page--update-search-button")).toBeInTheDocument();
    expect(getByTestId("edit-page--save-button-container")).toBeInTheDocument();
    expect(getByTestId("edit-page--save-button")).toBeInTheDocument();
  });
});