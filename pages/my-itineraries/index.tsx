import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from "../../styles/MyItineraries.module.scss";

const ItineraryListItem: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const router = useRouter();
  const createdDate = new Date(itinerary.createdDate);

  return (
    <div
      className={styles.listItem}
      onClick={() => router.push(`/itinerary/${itinerary.id}`)}  
    >
      <div className={styles.itineraryName}>{itinerary.name}</div>
      <div>Activities: {itinerary.activities.length}</div>
      <div>Created {createdDate.toLocaleDateString()}</div>
    </div>
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
      <div className={styles.listContainer}>
        <div className={styles.pageHead}>
          <h1>My Itineraries</h1>
          <div className={styles.sortByContainer}>
            <label htmlFor="sortBy">Sort by:</label>
            <select 
              name="sortBy"
              id="sortBy"
              className={styles.sortBy}
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        <div className={styles.itineraryList}>
          {itineraries.map((itinerary) => (
            <ItineraryListItem itinerary={itinerary} key={itinerary.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserItineraries;
