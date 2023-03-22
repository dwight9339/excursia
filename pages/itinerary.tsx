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
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
// import {
//   DragDropContext,
//   Droppable,
//   Draggable
// } from 'react-beautiful-dnd';

const ItineraryPage: React.FC = () => {
  const router = useRouter();
  const { itineraryData } = router.query;
  const [itinerary, setItinerary] = React.useState<any>(null);

  useEffect(() => {
    if (typeof itineraryData === 'string') {
      const parsedItinerary = JSON.parse(atob(itineraryData));
      setItinerary(parsedItinerary);
    }
  }, [itineraryData]);

  const handleDeleteActivity = (index: number) => {
    const updatedItinerary = [...itinerary.activities];
    updatedItinerary.splice(index, 1);
    setItinerary({ ...itinerary, activities: updatedItinerary });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Itinerary for {itinerary.location}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Number of activities: {itinerary.activities.length}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total time: {itinerary.totalTime} hours
      </Typography>

      <List>
        {itinerary.activities.map((activity: any, index: number) => (
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
    </Box>
  );
};

export default ItineraryPage;