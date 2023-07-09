import React from 'react';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from "../../styles/SuggestedActivities.module.scss";

interface SuggestedActivitiesProps {
  selectedActivities: string[];
  suggestions: google.maps.places.PlaceResult[];
  handleAddActivity: (activity: google.maps.places.PlaceResult) => void;
}

const SuggestedActivities: React.FC<SuggestedActivitiesProps> = ({ selectedActivities, suggestions, handleAddActivity }) => {
  const router = useRouter();

  return (
    <ul className={styles.container} data-testid="suggestion-list">
      {suggestions.map((suggestion, index) => {
        // const placePhoto: any = {...suggestion.photos?.[0]};
        // const photoRef = suggestion.photos ? placePhoto.photo_reference : null;
        // const photoUrl = photoRef ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}` : "";
        const suggestionObj: any = {...suggestion};
        const summary = suggestionObj.editorial_summary?.overview;
        const lat = suggestionObj.geometry?.location?.lat;
        const lng = suggestionObj.geometry?.location?.lng;

        return (
          <li 
            className={styles.suggestionListItem}
            key={index} 
          >
            <div className={styles.itemContainer}>
              <div className={styles.icon}>
                <Image 
                  alt={`${suggestion.name}`}
                  src={`${suggestion.icon}`}
                  width={30}
                  height={30}
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}&query_place_id=${suggestion.place_id}`}
                target="_blank"
              >
                <div className={styles.suggestionText}>
                  {suggestion.name}
                </div>
              </a>
              <IconButton
                className={styles.addButton}
                edge="end"
                color="inherit"
                onClick={() => handleAddActivity(suggestion)}
                disabled={selectedActivities.includes(`${suggestion.place_id}`)}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SuggestedActivities;
