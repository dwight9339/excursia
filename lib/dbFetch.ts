import { MongoClient, Db, Collection, ObjectId } from "mongodb";

export const fetchItinerary = async (id: string) => {
  const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
  await client.connect();
  const db: Db = client.db(`${process.env.DB_NAME}`);
  const itineraryCollection: Collection = db.collection("itinerary");
  
  const itinerary = await itineraryCollection.findOne({ _id: new ObjectId(`${id}`) });

  return itinerary;
}