import React from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from "next/router";

interface ItineraryProps {
  itinerary: Itinerary;
}

const fetchItinerary = async (id: string) => {
  const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
  await client.connect();
  const db: Db = client.db(`${process.env.DB_NAME}`);
  const itineraryCollection: Collection = db.collection("itinerary");
  
  const itinerary = await itineraryCollection.findOne({ _id: new ObjectId(`${id}`) });

  return itinerary;
}

const Itinerary: React.FC<ItineraryProps> = ({ itinerary }) => {
  if (!itinerary) return <div></div>;
  const { data, status } = useSession();
  const router = useRouter();
  const userData: any = { ...data?.user };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {itinerary.name}
      </Typography>
      <ul>
        {itinerary.activities.map((activity, index) => {
          const placeLink = `https://www.google.com/maps/place/?q=place_id:${activity.place.place_id}`;

          return (
            <li key={index} style={{
              listStyle: "none",
              marginBottom: 20,
              backgroundColor: "#f5f5f5",
              width: "fit-content",
              padding: "10px 20px",
            }}>
              <a href={placeLink}>
                <Typography variant="h6" gutterBottom>
                  {activity.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {activity.allottedTime} minutes
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {activity.place.vicinity}
                </Typography>
              </a>
            </li>
          );
        })}
      </ul>
    </Box>
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  try {
    const params: any = context.params;
    const { id } = params;
    const res = await fetchItinerary(id);

    if (res) {
      const {_id, ...itinerary} = res;
      console.log("Itinerary retrieved");
      return { props: { itinerary }};
    } else {
      console.log(`Unable to retrieve draft`);
      return { props: { itinerary: {}}}; 
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    return { props: { itinerary: {}}};
  }
};

export default Itinerary;