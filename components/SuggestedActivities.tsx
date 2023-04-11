import React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, List } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from "./SuggestedActivities.module.css";

interface SuggestedActivitiesProps {
  suggestions: google.maps.places.PlaceResult[];
  handleAddActivity: (activity: google.maps.places.PlaceResult) => void;
}

const SuggestedActivities: React.FC<SuggestedActivitiesProps> = ({ suggestions, handleAddActivity }) => {
  return (
    <List className={styles.container}>
      {suggestions.map((suggestion, index) => {
        const photoRef = suggestion.photos ? suggestion.photos[0].photo_reference : null;
        const photoUrl = photoRef ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}` : "";

        return (
          <ListItem key={index} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={suggestion.name} src={photoUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={suggestion.name}
              secondary={suggestion.formatted_address || suggestion.vicinity}
            />
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => handleAddActivity(suggestion)}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SuggestedActivities;