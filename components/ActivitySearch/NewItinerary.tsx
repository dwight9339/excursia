import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../../styles/NewItinerary.module.scss";
import ActivitySearchForm from "./ActivitySearchForm";

const NewItinerary: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();
  const defaultLocation = { lat: 38.764972, lng: -95.889472 } as google.maps.LatLngLiteral;
  const [itinerary, setItinerary] = useState<Itinerary>({
    name: "New Itinerary",
    startingLocation: defaultLocation,
    startingAddress: "",
    interests: [],
    searchRadius: 16093.4,
    activities: [],
    suggestions: [],
    createdDate: new Date().toISOString(),
    ownerId: `${data?.user?.id}`
  });
  const [creatingItinerary, setCreatingItinerary] = useState<boolean>(false);

  const handleCreateItinerary = async () => {
    setCreatingItinerary(true);
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
    } finally {
      setCreatingItinerary(false);
    }
  };

  return (
    <div className={styles.newItineraryContainer} data-testid="new-itinerary--container">
      <div className={styles.newItineraryHeader} data-testid="new-itinerary--header">
        <h1 className={styles.newItineraryTitle}>Where would you like to explore?</h1>
      </div>
      <div className={styles.newItineraryForm} data-testid="new-itinerary--form">
        <ActivitySearchForm
          itinerary={itinerary}
          updateItinerary={setItinerary}
          isDraft={true}
        />
      </div>
      <div className={styles.newItineraryFooter} data-testid="new-itinerary--footer">
        <button
          className={styles.createItineraryButton}
          data-testid="new-itinerary--submit-button"
          onClick={handleCreateItinerary}
          disabled={itinerary.startingAddress === "" || creatingItinerary}
        >
          {creatingItinerary ? "Creating Itinerary..." : "Create Itinerary"}
        </button>
      </div>
    </div>
  )
};

export default NewItinerary;