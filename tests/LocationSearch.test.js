import { render, fireEvent, waitFor } from '@testing-library/react';
import LocationSearch from '../components/LocationSearch';


describe('LocationSearch', () => {
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
    suggestions: [
      {
        name: 'Test Suggestion 1',
        geometry: {
          location: {
            lat: 40.7128,
            lng: -74.0060,
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
    ],
    createdDate: '2023-07-09',
    ownerId: '1',
  };

  it('renders correctly', () => {
    // const mockOnSelectLocation = jest.fn();

    // const { getByTestId, getByLabelText, debug } = render(
    //   <LocationSearch onSelectLocation={mockOnSelectLocation} itinerary={mockItinerary} />
    // );

    // // Check that the search bar is rendered
    // const searchBar = getByTestId('location-searchbar');
    // expect(searchBar).toBeInTheDocument();

    // Check that the search bar's value is set to the itinerary's starting address
    // expect(searchBar.value).toBe(mockItinerary.startingAddress);
  });

  // it('fetches and displays suggestions correctly', async () => {
  //   // Test if the component fetches and displays suggestions correctly as the user types in the search bar
  // });

  // it('fetches geocode and calls onSelectLocation prop function correctly when a suggestion is selected', async () => {
  //   // Test if the component correctly fetches the geocode for a selected suggestion and calls the onSelectLocation prop function with the correct arguments
  // });

  // it('sets search bar value to itinerary prop startingAddress and clears suggestions when itinerary prop changes', async () => {
  //   // Test if the component correctly sets the search bar's value to the itinerary prop's startingAddress and clears any suggestions when the itinerary prop changes
  // });

  // it('limits search area for suggestions based on itinerary prop startingLocation and searchRadius', async () => {
  //   // Test if the component correctly limits the search area for suggestions based on the itinerary prop's startingLocation and searchRadius
  // });
});
