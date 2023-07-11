import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ActivitySearchForm from '../components/ActivitySearch/ActivitySearchForm';
import { SessionProvider } from 'next-auth/react';

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
});
