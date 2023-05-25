import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection } from "mongodb";
import bcrypt from 'bcrypt';

// Generate the itinerary serverless function
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Extract user preferences from the request body
    const { email, password } = req.body;
    console.log(`Creating user: ${email}`);

    try {
      // Insert draft itinerary into DB
      const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
      await client.connect();
      const db: Db = client.db(process.env.DB_NAME);
      const usersCollection: Collection = db.collection("users");

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const newUser = { email, password: hash };
      const insertResult = await usersCollection.insertOne(newUser);

      // Return itinerary ID
      insertResult 
        ? res.status(201).json({ user_id: insertResult.insertedId })
        : res.status(500).json({ message: "Unable to create user"});
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
