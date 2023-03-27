import React, { useState, useEffect, useDebugValue } from 'react';
import {
  Container,
  Typography,
  Box,
  ListItem,
  ListItemText,
  IconButton,
  List
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { ParsedUrlQuery } from 'querystring';
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
  const [locationName, setLocationName] = useState<string>(draft.name);
  const [locationCenter, setLocationCenter] = useState<google.maps.LatLngLiteral | null>(draft.locationCenter);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>(draft.selectedActivities);
  const [otherOptions, setOtherOptions] = useState<google.maps.places.PlaceResult[]>(draft.otherOptions)

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Itinerary for {locationName}
      </Typography>
      <h3>Selected Activities</h3>
      <ActivityList
        activities={selectedActivities}
        onReorder={handleReorder}
        onDelete={handleDeleteActivity}
      />
      <h3>More Options Nearby</h3>
      {/* <List>
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