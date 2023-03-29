// pages/profile.tsx
import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';

interface ProfileProps {
  session: any;
}

const Profile: NextPage<ProfileProps> = ({ session }) => {
  console.log(`session: ${JSON.stringify(session)}`);

  const dummyItineraries = [
    { id: '1', name: 'Itinerary 1' },
    { id: '2', name: 'Itinerary 2' },
    { id: '3', name: 'Itinerary 3' },
  ];

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {session.user?.username}</p>
      <p>Email: {session.user?.email}</p>
      <h2>My Itineraries:</h2>
      <ul>
        {dummyItineraries.map((itinerary) => (
          <li key={itinerary.id}>
            <Link href={`/itinerary/${itinerary.id}`}>
              {itinerary.name}
            </Link>
          </li>
        ))}
      </ul>
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

  return {
    props: { session },
  };
}

export default Profile;
