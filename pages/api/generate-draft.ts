import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection } from "mongodb";

// Generate the itinerary serverless function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Extract user preferences from the request body
    const {
      location,
      searchRadius,
      startTime,
      endTime,
      interests,
    } = req.body;

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
      const numTopPicks = 5

      const draft = {
        name: "Draft Itinerary",  // TODO: Create better default naming
        locationCenter: location,
        selectedActivities: pointsOfInterest.slice(0, numTopPicks),
        otherOptions: pointsOfInterest.slice(numTopPicks)
      } as DraftItinerary;

      // Insert draft itinerary into DB
      const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const draftsCollection: Collection = db.collection("drafts");

      const insertResult = await draftsCollection.insertOne(draft);

      // Return draft ID
      insertResult 
        ? res.status(201).json({ draft_id: insertResult.insertedId })
        : res.status(500).json({ message: "Unable to create draft"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating draft itinerary' });
    }
  } else {
    // Return 405 Method Not Allowed for other request methods
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
