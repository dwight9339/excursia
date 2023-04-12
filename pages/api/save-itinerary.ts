import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { fetchSuggestions } from '../../lib/suggestions';

const insertNewItinerary = async (itinerary: Itinerary, db: Db) => {
  const itineraryCollection: Collection = db.collection("itinerary");
  const suggestions = await fetchSuggestions(itinerary);
  itinerary.suggestions = suggestions;
  const insertResult = await itineraryCollection.insertOne(itinerary);

  return insertResult;
};

const updateItinerary = async (itinerary: Itinerary, db: Db) => {
  const itineraryCollection: Collection = db.collection("itinerary");
  const updateResult = await itineraryCollection.updateOne(
    { _id: new ObjectId(itinerary.id) },
    { $set: { ...itinerary } }
  );

  return updateResult;
};

// Generate the itinerary serverless function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const itinerary = req.body;

    try {
      const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const itineraryCollection: Collection = db.collection("itinerary");
      const itineraryId: ObjectId = new ObjectId(itinerary.id);
      const currentItinerary = await itineraryCollection.findOne({ _id: itineraryId });

      if (!currentItinerary) {
        // Insert new itinerary
        const insertResult = await insertNewItinerary(itinerary, db);

        insertResult 
          ? res.status(201).json({ itinerary_id: insertResult.insertedId })
          : res.status(500).json({ message: "Unable to create itinerary"});
      } else {
        // Check if new itinerary has updates to activity search parameters
        const refetchSuggestions = currentItinerary.interests !== itinerary.interests
          || currentItinerary.searchRadius !== itinerary.searchRadius
          || currentItinerary.startLocation !== itinerary.startLocation;

        // Fetch new suggestions if needed
        if (refetchSuggestions) {
          const suggestions = await fetchSuggestions(itinerary);
          itinerary.suggestions = suggestions;
        }

        const updateResult = await updateItinerary(itinerary, db);

        updateResult 
          ? res.status(200).json({ itinerary_id: itinerary.id })
          : res.status(500).json({ message: "Unable to update itinerary"});
      }
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
