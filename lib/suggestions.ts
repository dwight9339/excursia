import axios from 'axios';

const fetchDetails = async (placeIds: string[]): Promise<google.maps.places.PlaceResult[]> => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const details = [];

  for(let i = 0; i < placeIds.length; i++) {
    const requestParams = {
      place_id: placeIds[i],
      key: apiKey
    };

    const response = await axios.get(baseUrl, {
      params: requestParams
    });

    details.push(response.data.result);
  }

  return details;
};

// Fetch suggestions from the Google Places API
export const fetchSuggestions = async (itinerary: Itinerary): Promise<google.maps.places.PlaceResult[]> => {
  const { interests, searchRadius, startingLocation } = itinerary;

  try {
    // Prepare the Google Places API request
    const baseUrl =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const requestParams = {
      // TODO: Tailor search query to user specified preferences
      keyword: `things to do ${interests.join(' ')}`,
      location: `${startingLocation.lat},${startingLocation.lng}`,
      radius: searchRadius * 1609.34,   // Convert miles to meters
      key: apiKey
    };

    const response = await axios.get(baseUrl, {
      params: requestParams
    });

    // Fetch details for each place
    const placeIds = response.data.results.map((result: google.maps.places.PlaceResult) => result.place_id);
    const details = await fetchDetails(placeIds);

    return details;
  } catch (error) {
    console.error(error);
    return [];
  } 
};