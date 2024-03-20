import { NextApiRequest, NextApiResponse } from 'next';
import { fetchItinerary } from '../../lib/dbFetch';
import { MongoClient } from 'mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const client: MongoClient = await MongoClient.connect(`${process.env.MONGO_DB_URI}`);

    try {
      const itinerary = await fetchItinerary(client, req.query.id as string);

      itinerary ? res.status(200).json(itinerary) : res.status(404).json({ message: "Itinerary not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to fetch itinerary" });
    } finally {
      if (client) {
        client.close();
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}