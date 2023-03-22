import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Generate the itinerary serverless function
export default async (req, res) => {
  if (req.method === 'POST') {
    // Extract user preferences from the request body
    const {
      location,
      searchRadius,
      startTime,
      endTime,
      interests,
    } = req.body;

    const all_search_types = [
      "amusement park",
      "aquarium",
      "art gallery",
      "bakery",
      "bar",
      "book store",
      "bowling_alley",
      "cafe",
      "casino",
      "cemetary",
      "church",
      "clothing_store",
      "department_store",
      "movie theater",
      "museum",
      "night club",
      "restaurant",
      "shoe store",
      "tourist_attraction",
      "zoo"
    ]

    try {
      // Prepare the Google Places API request
      const baseUrl =
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
      const requestParams = {
        // TODO: Tailor search query to user specified preferences
        keyword: "fun",
        location: `${location.lat},${location.lng}`,
        radius: searchRadius * 1609.34,   // Convert miles to meters
        key: apiKey
      };

      const response = await axios.get(baseUrl, {
        params: requestParams
      });

      // Extract points of interest from the API response
      const pointsOfInterest = response.data.results;

      // TODO: Filter points of interest by relevance and time constraints

      // Send the generated itinerary as the response
      res.status(200).json({ itinerary: pointsOfInterest });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating itinerary' });
    }
  } else {
    // Return 405 Method Not Allowed for other request methods
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
