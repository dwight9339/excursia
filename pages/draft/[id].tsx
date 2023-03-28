import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from "next/router";
import ActivityList from './ActivityList';

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
  const [itineraryName, setItineraryName] = useState<string>(draft.name);
  const [locationCenter, setLocationCenter] = useState<google.maps.LatLngLiteral | null>(draft.locationCenter);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>(draft.selectedActivities);
  const [otherOptions, setOtherOptions] = useState<google.maps.places.PlaceResult[]>(draft.otherOptions);
  const [isSaving, setIsSaving] = useState<boolean>(false);

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
    setIsSaving(true);
    const itinerary = {
      name: itineraryName,
      locationCenter,
      activities: selectedActivities
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
        // Redirect to a success page or show a success message
      } else {
        console.error('Error saving itinerary:', response.statusText);
        // Show an error message
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
      // Show an error message
    } finally {
      setIsSaving(false);
    }
  };
  

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {itineraryName}
      </Typography>
      <h3>Selected Activities</h3>
      <ActivityList
        activities={selectedActivities}
        onReorder={handleReorder}
        onDelete={handleDeleteActivity}
      />
      {/* <h3>More Options Nearby</h3>
       <List>
        {otherOptions.map((activity: any, index: number) => (
          <ListItem key={index}>
            <ListItemText
              primary={activity.name}
              secondary={`${activity.address} - ${activity.description}`}
            />
            <IconButton edge="end" onClick={() => handleAddActivity(index)}>
              <AddIcon />
            </IconButton>
          </ListItem>
        ))}
      </List> */}
      <button onClick={handleSaveItinerary} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </Box>
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  try {
    const { id } = context.params;
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