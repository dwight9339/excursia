import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { fetchSuggestions } from '../../lib/suggestions';

const loadCollection = async () => {
  const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
  await client.connect();
  const db: Db = client.db(process.env.DB_NAME);
  const itineraryCollection: Collection = db.collection("itinerary");

  return itineraryCollection;
};

const fetchItinerary = async (itineraryId: string, collection: Collection) => {
  const itinerary = await collection.findOne({ _id: new ObjectId(itineraryId) });

  return itinerary;
};

const insertNewItinerary = async (itinerary: Itinerary, collection: Collection) => {
  const suggestions = await fetchSuggestions(itinerary);
  itinerary.suggestions = suggestions;
  itinerary.createdDate = new Date().toISOString();
  const insertResult = await collection.insertOne(itinerary);

  return insertResult;
};

const updateItinerary = async (itinerary: Itinerary, collection: Collection) => {
  const updateResult = await collection.updateOne(
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
      const itineraryCollection: Collection = await loadCollection();
      const currentItinerary = await fetchItinerary(itinerary.id, itineraryCollection);

      if (!currentItinerary) {
        // Insert new itinerary
        const insertResult = await insertNewItinerary(itinerary, itineraryCollection);

        insertResult 
          ? res.status(201).json({ itinerary_id: insertResult.insertedId })
          : res.status(500).json({ message: "Unable to create itinerary"});
      } else {
        // Check if new itinerary has updates to activity search parameters
        const refetchSuggestions = currentItinerary.interests.toString() !== itinerary.interests.toString()
          || currentItinerary.searchRadius !== itinerary.searchRadius
          || currentItinerary.startLocation !== itinerary.startLocation;

        // Fetch new suggestions if needed
        if (refetchSuggestions) {
          const suggestions = await fetchSuggestions(itinerary);
          itinerary.suggestions = suggestions;
        }

        const updateResult = await updateItinerary(itinerary, itineraryCollection);

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
