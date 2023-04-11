import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from "next/router";
import { useLoadScript } from "@react-google-maps/api";
import ActivityList from '../../../components/ActivityList';
import styles from "./EditItinerary.module.css"
import TimeSelector from '../../../components/TimeSelector';
import EditableText from '../../../components/EditableText';
import ItineraryMap from '../../../components/ItineraryMap';
import { fetchItinerary } from '../../../lib/dbFetch';
import SuggestedActivities from '../../../components/SuggestedActivities';
import TripSummary from '../../../components/TripSummary';

interface EditItineraryProps {
  itineraryId: string | null;
  itinerary: Itinerary;
}

const EditItinerary: React.FC<EditItineraryProps> = ({ itineraryId, itinerary }) => {
  if (!itinerary) return <div></div>;
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });
  const { data, status } = useSession();
  const router = useRouter();
  const userData: any = { ...data?.user };

  const [itineraryName, setItineraryName] = useState<string>(itinerary.name);
  const [startLocation, setStartLocation] = useState<google.maps.LatLngLiteral | undefined>(itinerary.startingLocation);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>(itinerary.activities);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(new Date(itinerary.startTime));
  const [directions, setDirections] = useState<google.maps.DirectionsResult | undefined>(itinerary.directions);

  const handleDirectionsResult = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status !== google.maps.DirectionsStatus.OK) {
      console.log(`Directions failed: ${status}`);
      return;
    } else {
      console.log(`Directions updated: ${status}`);
    }
    setDirections(result || undefined);
  };

  const getDirections = async () => {
    const startLocation = itinerary.startingLocation;
    const endLocation = selectedActivities[selectedActivities.length - 1].place?.geometry?.location;
    const waypoints = selectedActivities.slice(0, selectedActivities.length - 1).map((activity) => ({
      location: activity.place?.geometry?.location,
      stopover: true
    }));

    if (!startLocation || !endLocation) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      handleDirectionsResult
    );
  }

  useEffect(() => {
    if (selectedActivities.length > 0) {
      getDirections();
    }
  }, [selectedActivities]);

  const handleDeleteActivity = (index: number) => {
    const newActivities = [...selectedActivities];
    setSelectedActivities(newActivities);
  };

  const handleAddActivity = (activity: Activity) => {
      setSelectedActivities((prev) => [...prev, activity]);
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const newActivities = [...selectedActivities];
    const removed = newActivities.splice(startIndex, 1)[0];
    newActivities.splice(endIndex, 0, removed);
    setSelectedActivities(newActivities);
  }

  // const handleSaveItinerary = async () => {
  //   if (!(status === 'authenticated')) {
  //     router.push('/api/auth/signin');
  //     return;
  //   }

  //   setIsSaving(true);
    

  //   try {
  //     const response = await fetch('/api/save-itinerary', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(itinerary),
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Itinerary saved with ID:', data.id);
  //     } else {
  //       console.error('Error saving itinerary:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error saving itinerary:', error);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  

  return (
    <Box>
      <div className={styles.itineraryHeader}>
        <div className={styles.titleContainer}>
          <EditableText
            text={itineraryName}
            onEdit={(newName) => setItineraryName(newName)}
          />
        </div>
      </div>
      <div className={styles.columnContainer}>
        <div className={styles.leftColumn}>
          <h3>Trip Details</h3>
          <div className={styles.dateTimeSelectContainer}>
            <TimeSelector
              onDateTimeChange={(dateTime) => console.log(dateTime)}
            />
          </div>
          <div className={styles.tripSummararyContainer}>
            <TripSummary
              activities={selectedActivities}
              directions={directions}
              startTime={startTime}
            />
          </div>
          <div className={styles.mapContainer}>
            <ItineraryMap
              directions={directions}
              location={startLocation}
              activities={selectedActivities}
              zoomLevel={7}
              mapWidth={700}
              mapHeight={600}
            />
          </div>
          <div className={styles.saveButtonContainer}>
            <button disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className={styles.middleColumn}>
          <div className={styles.selectedActivitiesContainer}>
            <h3>Selected Activities</h3>
            <ActivityList
              activities={selectedActivities}
              onReorder={handleReorder}
              onTimeUpdate={(index, newTime) => {
                const newActivities = [...selectedActivities];
                newActivities[index].allottedTime = newTime;
                setSelectedActivities(newActivities);
              }}
              onDelete={handleDeleteActivity}
            />
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.SuggestedActivitiesContainer}>
            <h3>Suggested Activities</h3>
            <SuggestedActivities
              suggestions={itinerary.suggestions}
              handleAddActivity={(suggestion: google.maps.places.PlaceResult) => {
                const activity: Activity = {
                  name: `${suggestion.name}`,
                  place: suggestion,
                  allottedTime: 60
                };
                handleAddActivity(activity);
              }} 
            />
          </div>
        </div>
      </div>
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
      return { props: {
        itineraryId: id,
        itinerary
      }};
    } else {
      console.log(`Unable to retrieve itinerary with id: ${id}`);
      return { props: {
        itineraryId: null,
        itinerary: {}
      }}; 
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    return { props: { itinerary: {}}};
  }
};

export default EditItinerary;