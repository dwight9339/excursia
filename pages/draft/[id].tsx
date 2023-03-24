import React, { useState, useEffect } from 'react';
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
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { ParsedUrlQuery } from 'querystring';
// TODO: Implement drag-drop list reordering
// import {
//   DragDropContext,
//   Droppable,
//   Draggable
// } from 'react-beautiful-dnd';

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
  const [selectedActivities, setSelectedActivities] = useState<google.maps.Place[]>(draft.selectedActivities);
  const [otherOptions, setOtherOptions] = useState<google.maps.Place[]>(draft.otherOptions)

  const handleDeleteActivity = (index: number) => {
    const newActivities = [...selectedActivities];
    const removedActivity = newActivities.splice(index, 1)[0];
    setSelectedActivities(newActivities);
    setOtherOptions((prev) => [...prev, removedActivity]);
  };

  const handleAddActivity = (index: number) => {
    const newOthers = [...otherOptions];
    const removed = newOthers.splice(index, 1)[0];
    setSelectedActivities((prev) => [...prev, removed]);
    setOtherOptions(newOthers);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Itinerary for {locationName}
      </Typography>
      <h3>Selected Activities</h3>
      <List>
        {selectedActivities.map((activity: any, index: number) => (
          <ListItem key={index}>
            <IconButton edge="start">
              <DragIndicatorIcon />
            </IconButton>
            <ListItemText
              primary={activity.name}
              secondary={`${activity.address} - ${activity.description}`}
            />
            <IconButton edge="end" onClick={() => handleDeleteActivity(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <h3>More Options Nearby</h3>
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
      </List>
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