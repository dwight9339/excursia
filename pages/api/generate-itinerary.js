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
      travelBoundaries,
      startTime,
      endTime,
      interests,
    } = req.body;

    try {
      // Prepare the Google Places API request
      const baseUrl =
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      const types = interests.join('|');

      const response = await axios.get(baseUrl, {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: travelBoundaries,
          type: types,
          key: apiKey,
        },
      });

      // Extract points of interest from the API response
      const pointsOfInterest = response.data.results;

      // TODO: Generate the itinerary based on the points of interest and user preferences

      // Send the generated itinerary as the response
      res.status(200).json({ itinerary: 'Generated itinerary goes here' });
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
