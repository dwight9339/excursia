import axios from 'axios';

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

    return response.data.results;
  } catch (error) {
    console.error(error);
    return [];
  } 
};