// pages/profile.tsx
import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { MongoClient, Db, Collection, WithId } from 'mongodb';

const fetchItineraries = async (userId: string) => {
  const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
  await client.connect();
  const db: Db = client.db(`${process.env.DB_NAME}`);
  const itineraryCollection: Collection = db.collection("itinerary");
  const itineraryDocs = await itineraryCollection.find({ createdBy: userId }).toArray();

  if (itineraryDocs.length === 0) console.log(`No itineraries found for user ${userId}`);
  else console.log(`Found ${itineraryDocs.length} itineraries for user ${userId}`);
  const itineraries = itineraryDocs.map((itinerary) => {
    return {
      id: `${itinerary._id}`,
      name: itinerary.name
    }
  });

  return itineraries;
}

interface ProfileProps {
  session: any;
  itineraries: any[];
}

const ItineraryList: React.FC<{ itineraries: any[] }> = ({ itineraries }) => {
  return (
    <ul>
      {itineraries.map((itinerary) => (
        <li key={itinerary.id}>
          <Link href={`/itinerary/${itinerary.id}`}>
            {itinerary.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Profile: NextPage<ProfileProps> = ({ session, itineraries }) => {
  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {session.user?.username}</p>
      <p>Email: {session.user?.email}</p>
      {itineraries.length > 0 && (
        <>
          <h2>Itineraries</h2>
          <ItineraryList itineraries={itineraries} />
        </>
      )}
    </div>
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  const userData: any = { ...session.user };  
  const itineraries = await fetchItineraries(userData.id);

  return {
    props: { session, itineraries },
  };
}

export default Profile;
