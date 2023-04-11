import React from 'react';
import { Box, Typography } from '@mui/material';

interface ItinerarySummaryProps {
  activities: Activity[];
  directions: google.maps.DirectionsResult | undefined;
  startTime: Date | null;
}

const TripSummary: React.FC<ItinerarySummaryProps> = ({ activities, directions, startTime }) => {
  if (!directions) return null;

  const travelTimeMinutes = directions.routes[0].legs.reduce((acc, leg) => acc + (leg.duration?.value || 0), 0) / 60;
  const activityTimeMinutes = activities.reduce((acc, activity) => acc + activity.allottedTime, 0);
  const travelTimeHours = Math.floor(travelTimeMinutes / 60);
  const activityTimeHours = Math.floor(activityTimeMinutes / 60);
  const travelTime = travelTimeHours > 0 ? `${travelTimeHours.toFixed(0)} hours and ${(travelTimeMinutes % 60).toFixed(0)} minutes` : `${travelTimeMinutes.toFixed(0)} minutes`;
  const activityTime = activityTimeHours > 0 ? `${activityTimeHours.toFixed(0)} hours and ${(activityTimeMinutes % 60).toFixed(0)} minutes` : `${activityTimeMinutes} minutes`;

  if (!startTime) return (
    <Box>
      <Typography variant="h6">Itinerary Summary</Typography>
      <Typography variant="body1">Total time spent traveling: {travelTime}</Typography>
      <Typography variant="body1">Total time spent at activities: {activityTime}</Typography>
    </Box>
  );;

  const endTime = new Date(startTime.getTime());
  endTime.setMinutes(endTime.getMinutes() + travelTimeMinutes + activityTimeMinutes);

  return (
    <Box>
      <Typography variant="h6">Itinerary Summary</Typography>
      <Typography variant="body1">Total time spent traveling: {travelTime}</Typography>
      <Typography variant="body1">Total time spent at activities: {activityTime}</Typography>
      <Typography variant="body1">End time: {endTime.toLocaleTimeString()}</Typography>
    </Box>
  );
};

export default TripSummary;