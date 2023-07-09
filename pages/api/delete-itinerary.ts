import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// Delete an itinerary serverless function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const { itineraryId } = req.query;
    const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);

    try {
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const itinerariesCollection: Collection = db.collection('itinerary');

      const itinerary = await itinerariesCollection.findOne({ _id: new ObjectId(itineraryId as string) });

      // Check if the itinerary exists
      if (!itinerary) {
        res.status(404).json({ success: false, error: 'Itinerary not found' });
        return;
      }

      const deleteResult = await itinerariesCollection.deleteOne({ _id: new ObjectId(itineraryId as string) });
      res.status(200).json({ success: true, deleteResult });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    } finally {
      await client.close();
    }
  } else {
    // Return 405 Method Not Allowed for other request methods
    res.setHeader('Allow', 'DELETE');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};