import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection } from "mongodb";

// Generate the itinerary serverless function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Extract user preferences from the request body
    const itinerary = req.body;

    try {
      // Insert draft itinerary into DB
      const client: MongoClient = new MongoClient(`${process.env.MONGODB_URI}`);
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const itineraryCollection: Collection = db.collection("itinerary");

      const insertResult = await itineraryCollection.insertOne(itinerary);

      // Return itinerary ID
      insertResult 
        ? res.status(201).json({ itinerary_id: insertResult.insertedId })
        : res.status(500).json({ message: "Unable to create itinerary"});
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
