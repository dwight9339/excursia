import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { CircularProgress } from "@mui/material";
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
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("date");

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

  const sortItineraries = () => {
    const sortedItineraries = [...itineraries];
    if (sortBy === "newest") {
      sortedItineraries.sort((a, b) => {
        const aDate = new Date(a.createdDate);
        const bDate = new Date(b.createdDate);
        return bDate.getTime() - aDate.getTime();
      });
    } else if (sortBy === "oldest") {
      sortedItineraries.sort((a, b) => {
        const aDate = new Date(a.createdDate);
        const bDate = new Date(b.createdDate);
        return aDate.getTime() - bDate.getTime();
      });
    } else if (sortBy === "mostActivities") {
      sortedItineraries.sort((a, b) => {
        return b.activities.length - a.activities.length;
      });
    } else if (sortBy === "leastActivities") {
      sortedItineraries.sort((a, b) => {
        return a.activities.length - b.activities.length;
      });
    } else if (sortBy === "nameAsc") {
      sortedItineraries.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (sortBy === "nameDesc") {
      sortedItineraries.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }

    setItineraries(sortedItineraries);
  };

  useEffect(() => {
    sortItineraries();
  }, [itineraries.length, sortBy]);

  if (loading || status === "loading") {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <CircularProgress
            className={styles.spinner}
            color="inherit"
          />
        </div>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noItinerariesContainer}>
          <div className={styles.noItinerariesText}>
            You have no itineraries yet.
          </div>
          <div 
            className={styles.newItineraryButton}
            onClick={() => router.push("/")}
          >
            Create New Itinerary
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHead}>
        <h1>My Itineraries</h1>
        <div className={styles.sortByContainer}>
          <label htmlFor="sortBy">Sort by:</label>
          <select 
            name="sortBy"
            id="sortBy"
            className={styles.sortBy}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostActivities">Most Activities</option>
            <option value="leastActivities">Least Activities</option>
            <option value="nameAsc">Name A-Z</option>
            <option value="nameDesc">Name Z-A</option>
          </select>
        </div>
      </div>
      <div className={styles.listContainer}>
        {itineraries.map((itinerary) => (
          <ItineraryListItem itinerary={itinerary} key={itinerary.id} />
        ))}
      </div>
    </div>
  );
};

export default UserItineraries;
