import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from "next/router";
import { Edit as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ActivityList from '../../../components/ActivityList';
import styles from "./EditItinerary.module.css"
import TimeSelector from '../../../components/TimeSelector';
import EditableText from '../../../components/EditableText';
import ItineraryMap from '../../../components/ItineraryMap';
import { fetchItinerary } from '../../../lib/dbFetch';
import SuggestedActivities from '../../../components/SuggestedActivities';

interface EditItineraryProps {
  itineraryId: string | null;
  itinerary: Itinerary;
}

const EditItinerary: React.FC<EditItineraryProps> = ({ itineraryId, itinerary }) => {
  if (!itinerary) return <div></div>;
  const { data, status } = useSession();
  const router = useRouter();
  const userData: any = { ...data?.user };

  const [itineraryName, setItineraryName] = useState<string>(itinerary.name);
  const [startLocation, setStartLocation] = useState<google.maps.LatLngLiteral | undefined>(itinerary.startingLocation);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>(itinerary.activities);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(new Date(itinerary.startTime));

  useEffect(() => {
    console.log(`Selected Activities: ${selectedActivities.map((activity) => activity && activity.name + ': ' + activity.allottedTime + ' minutes')}`);
  }, [selectedActivities]);

  const handleDeleteActivity = (index: number) => {
    const newActivities = [...selectedActivities];
    setSelectedActivities(newActivities);
  };

  const handleAddActivity = (suggestion: google.maps.places.PlaceResult) => {
      const newActivity = {
        name: suggestion.name,
        allottedTime: 60,
        place: suggestion
      } as Activity;
      setSelectedActivities((prev) => [...prev, newActivity]);
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
      <h1>Editing Itinerary</h1>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.titleContainer}>
            <EditableText
              text={itineraryName}
              onEdit={(newName) => setItineraryName(newName)}
            />
          </div>
          <div className={styles.dateTimeSelectContainer}>
            <h3>Start Time</h3>
            <TimeSelector
              onDateTimeChange={(dateTime) => console.log(dateTime)}
            />
          </div>
          <div className={styles.mapContainer}>
            <ItineraryMap
              location={startLocation}
              activities={selectedActivities}
              zoomLevel={7}
              mapWidth={900}
              mapHeight={600}
            />
          </div>
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
          <div className={styles.saveButtonContainer}>
            <button disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.SuggestedActivitiesContainer}>
            <h3>Suggested Activities</h3>
            <SuggestedActivities
              suggestions={itinerary.suggestions}
              handleAddActivity={handleAddActivity} 
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