import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardMedia,
  Button,
} from '@mui/material';

interface SuggestedActivitiesProps {
  suggestions: google.maps.places.PlaceResult[];
  handleAddActivity: (suggestion: google.maps.places.PlaceResult) => void;
}

const SuggestedActivities: React.FC<SuggestedActivitiesProps> = ({
  suggestions,
  handleAddActivity
}) => {
  if (!suggestions) return <div></div>;

  return (
    <Grid container spacing={2}>
      {suggestions.map((suggestion, index) => (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea>
              {/* <CardMedia
                component="img"
                height="140"
                image={suggestion.photoUrl}
                alt={suggestion.name}
              /> */}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {suggestion.name}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {suggestion.description}
                </Typography> */}
              </CardContent>
            </CardActionArea>
            <Button
              onClick={() => handleAddActivity(suggestion)}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SuggestedActivities;
