import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection } from 'mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const userId = req.query.user_id;

    if (!userId) {
      res.status(400).json({ error: 'Missing user_id query parameter' });
      return;
    }

    const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);

    try {
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const itinerariesCollection: Collection = db.collection('itinerary');

      const itineraries = await itinerariesCollection.find({ ownerId: userId }).toArray();
      client.close();
      const itinerariesWithId = itineraries.map((itinerary) => {
        const { _id, ...rest } = itinerary;
        return {
          id: _id,
          ...rest,
        };
      });

      res.status(200).json({ itineraries: itinerariesWithId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching itineraries' });
    } finally {
      await client.close();
    }
  } else {
    // Return 405 Method Not Allowed for other request methods
    res.setHeader('Allow', 'GET');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
