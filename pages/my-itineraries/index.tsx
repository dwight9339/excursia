import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from "./UserItineraries.module.css";

const ItineraryListItem: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const router = useRouter();
  const createdDate = new Date(itinerary.createdDate);

  return (
    <li>
      <div
        className={styles.listItemContainer}
        onClick={() => router.push(`/itinerary/${itinerary.id}`)}  
      >
        <div className={styles.itineraryName}>{itinerary.name}</div>
        <div>Activities: {itinerary.activities.length}</div>
        <div>Created {createdDate.toLocaleDateString()}</div>
      </div>
    </li>
  );
};

const UserItineraries: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch(`/api/fetch-itineraries?user_id=${userId}`);
        const data = await response.json();
        setItineraries(data.itineraries);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (itineraries.length === 0) {
    return <div>No itineraries found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Itineraries</h2>
      </div>
      <div className={styles.listContainer}>
        <ul className={styles.itineraryList}>
          {itineraries.map((itinerary) => (
            <ItineraryListItem itinerary={itinerary} key={itinerary.id} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserItineraries;
