import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../../styles/NewItinerary.module.scss";
import ActivitySearchForm from "./ActivitySearchForm";

const NewItinerary: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary>({
    name: "New Itinerary",
    startingLocation: { lat: 38.764972, lng: -95.889472 } as google.maps.LatLngLiteral,
    interests: [],
    searchRadius: 16093.4,
    activities: [],
    suggestions: [],
    createdDate: new Date().toISOString(),
    ownerId: data?.user?.id
  });

  const handleCreateItinerary = async () => {
    const date = new Date();
    const userData: any = {...data?.user};

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itinerary),
    };

    try {
      const response = await fetch('/api/save-itinerary', requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        console.log(`Itinerary ID: ${data.itinerary_id}`);
        router.push(`/itinerary/${data.itinerary_id}/edit`);
      } else {
        // Handle any error messages received
        console.error('Error generating itinerary:', data.message);
      }
    } catch (error) {
      // Handle any network errors
      console.error('Error fetching itinerary:', error);
    }
  };

  return (
    <div className={styles.newItineraryContainer}>
      <div className={styles.newItineraryHeader}>
        <h1 className={styles.newItineraryTitle}>Where would you like to explore?</h1>
      </div>
      <div className={styles.newItineraryForm}>
        <ActivitySearchForm
          itinerary={itinerary}
          updateItinerary={setItinerary}
          isDraft={true}
        />
      </div>
      <div className={styles.newItineraryFooter}>
        <button
          className={styles.createItineraryButton}
          onClick={handleCreateItinerary}
        >
          Create Itinerary
        </button>
      </div>
    </div>
  )
};

export default NewItinerary;