import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from "next/router";
import { Edit as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ActivityList from '../../components/ActivityList';
import styles from "./Draft.module.css"
import TimeSelector from '../../components/TimeSelector';

interface DraftProps {
  draft: DraftItinerary;
}

const fetchDraft = async (id: string) => {
  const client: MongoClient = new MongoClient(`${process.env.MONGO_DB_URI}`);
  await client.connect();
  const db: Db = client.db(`${process.env.DB_NAME}`);
  const draftCollection: Collection = db.collection("drafts");
  
  const draft = await draftCollection.findOne({ _id: new ObjectId(`${id}`) });

  return draft;
}

const Draft: React.FC<DraftProps> = ({ draft }) => {
  if (!draft) return <div></div>;
  const { data, status } = useSession();
  const router = useRouter();
  const userData: any = { ...data?.user };

  const [itineraryName, setItineraryName] = useState<string>(draft.name);
  const [locationCenter, setLocationCenter] = useState<google.maps.LatLngLiteral | null>(draft.locationCenter);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>(draft.selectedActivities);
  const [otherOptions, setOtherOptions] = useState<google.maps.places.PlaceResult[]>(draft.otherOptions);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(new Date(draft.startTime));

  useEffect(() => {
    console.log(`Selected Activities: ${selectedActivities.map((activity) => activity && activity.name)}`);
  }, [selectedActivities]);

  const handleDeleteActivity = (index: number) => {
    const newActivities = [...selectedActivities];
    const removedActivity = newActivities.splice(index, 1)[0];
    setSelectedActivities(newActivities);
    setOtherOptions((prev) => [...prev, removedActivity.place]);
  };

  const handleAddActivity = (index: number) => {
    const newOthers = [...otherOptions];
    const removed = newOthers.splice(index, 1)[0];
    setSelectedActivities((prev) => [
      ...prev, 
      {
        name: removed.name,
        allottedTime: 60,
        place: removed
      } as Activity
    ]);
    setOtherOptions(newOthers);
  }

  const handleReorder = (startIndex: number, endIndex: number) => {
    const newActivities = [...selectedActivities];
    const removed = newActivities.splice(startIndex, 1)[0];
    newActivities.splice(endIndex, 0, removed);
    setSelectedActivities(newActivities);
  }

  const handleSaveItinerary = async () => {
    if (!(status === 'authenticated')) {
      router.push('/api/auth/signin');
      return;
    }

    setIsSaving(true);
    const itinerary = {
      name: itineraryName,
      locationCenter,
      activities: selectedActivities,
      createdBy: userData.id
    } as Itinerary;

    try {
      const response = await fetch('/api/save-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Itinerary saved with ID:', data.id);
      } else {
        console.error('Error saving itinerary:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
    } finally {
      setIsSaving(false);
    }
  };
  

  return (
    <Box>
      <div className={styles.container}>
        <div className={styles.draftTitleContainer}>
          {editingTitle ? 
            <input
              autoFocus
              className={styles.draftTitleInput}
              type="text"
              value={itineraryName}
              onChange={(e) => setItineraryName(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingTitle(false);
                  }
                }
              }
            />
            :
            <>
              <Typography variant="h4" component="h1" className={styles.draftTitle}>
                {itineraryName}
              </Typography>
              <IconButton 
                className={styles.titleEditButton}
                onClick={() => setEditingTitle(true)}
              >
                <EditIcon />
              </IconButton>
            </>
          }
        </div>
        <div className={styles.dateTimeSelectContainer}>
          <h3>Start Time</h3>
          <TimeSelector
            onDateTimeChange={(dateTime) => console.log(dateTime)}
          />
        </div>
        <div className={styles.selectedActivitiesContainer}>
          <h3>Selected Activities</h3>
          <ActivityList
            activities={selectedActivities}
            onReorder={handleReorder}
            onDelete={handleDeleteActivity}
          />
          <button onClick={handleSaveItinerary} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Box>
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  try {
    const params: any = context.params;
    const { id } = params;
    const res = await fetchDraft(id);

    if (res) {
      const {_id, ...draft} = res;
      console.log("Draft retrieved");
      return { props: { draft }};
    } else {
      console.log(`Unable to retrieve draft`);
      return { props: { draft: {}}}; 
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    return { props: { draft: {}}};
  }
};

export default Draft;