import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection } from "mongodb";

// Generate the itinerary serverless function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const itinerary = req.body;
    console.log(`itinerary: ${JSON.stringify(itinerary)}`);

    try {
      const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const itineraryCollection: Collection = db.collection("itinerary");

      const insertResult = await itineraryCollection.insertOne(itinerary);

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
