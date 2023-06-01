import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

// Generate the itinerary serverless function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Extract user preferences from the request body
    const { userId, userInfo } = req.body;

    try {
      // Insert draft itinerary into DB
      const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const usersCollection: Collection = db.collection("users");

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { ...userInfo } }
      );

      // Return itinerary ID
      updateResult 
        ? res.status(200).json({ message: "User updated" })
        : res.status(500).json({ message: "Unable to update user"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    // Return 405 Method Not Allowed for other request methods
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
