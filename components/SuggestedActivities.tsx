import React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, List } from '@mui/material';
import { useRouter } from 'next/router';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from "./SuggestedActivities.module.css";

interface SuggestedActivitiesProps {
  selectedActivities: string[];
  suggestions: google.maps.places.PlaceResult[];
  handleAddActivity: (activity: google.maps.places.PlaceResult) => void;
}

const SuggestedActivities: React.FC<SuggestedActivitiesProps> = ({ selectedActivities, suggestions, handleAddActivity }) => {
  const router = useRouter();

  return (
    <List className={styles.container}>
      {suggestions.map((suggestion, index) => {
        // const placePhoto: any = {...suggestion.photos?.[0]};
        // const photoRef = suggestion.photos ? placePhoto.photo_reference : null;
        // const photoUrl = photoRef ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}` : "";
        const suggestionObj: any = {...suggestion};
        const summary = suggestionObj.editorial_summary?.overview;

        return (
          <ListItem 
            key={index} 
            alignItems="flex-start"
          >
            <ListItemAvatar>
              <Avatar alt={suggestion.name} src={suggestion.icon} />
            </ListItemAvatar>
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${suggestion.place_id}`}
              target="_blank"
            >
              <ListItemText
                primary={suggestion.name}
                secondary={summary || ""}
              />
            </a>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => handleAddActivity(suggestion)}
              disabled={selectedActivities.includes(`${suggestion.place_id}`)}
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
