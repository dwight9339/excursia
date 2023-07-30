import { MongoClient, Db, Collection, ObjectId } from "mongodb";

export const fetchItinerary = async (client: MongoClient, id: string) => {
    const db: Db = client.db(`${process.env.DB_NAME}`);
    const itineraryCollection: Collection = db.collection("itinerary");
    
    const itinerary = await itineraryCollection.findOne({ _id: new ObjectId(`${id}`) });
    if (!itinerary) {
      return null;
    }
    const { _id, ..._itinerary } = itinerary;

    return { id: `${_id}`, ..._itinerary } as Itinerary;
}

export const fetchUserById = async (id: string) => {
  const client = new MongoClient(`${process.env.MONGO_DB_URI}`);
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const userCollection = db.collection("users");
    
    // Query for user with email and password
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    client.close();

    if (user) {
      const {_id, password: userPassword, ...userObj} = user;
      userObj["id"] = _id;
      console.log(`User: ${JSON.stringify(userObj)}`);
      return userObj;
    } else {
      console.log("User not found");
      return null;
    }
  } catch(err) {
    console.log(`User fetch error: ${err}`);
    return null;
  } finally {
    await client.close();
  }
}