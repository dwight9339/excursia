// components/RouteOptions.tsx
import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, MenuItem, FormControl, Select } from '@mui/material';
import { useLoadScript } from "@react-google-maps/api";

interface RouteOptionsProps {
  routeOptions: RouteOptions;
  onRouteOptionsChange: (newOptions: RouteOptions) => void;
}

const RouteOptions: React.FC<RouteOptionsProps> = ({ routeOptions, onRouteOptionsChange }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: ["places"]
  });
  if (!isLoaded) return null;

  const handleOptionChange = (optionName: keyof RouteOptions) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRouteOptionsChange({
      ...routeOptions,
      [optionName]: event.target.checked,
    });
  };

  const handleTravelModeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    onRouteOptionsChange({
      ...routeOptions,
      travelMode: event.target.value as google.maps.TravelMode,
    });
  };

  return (
    <div>
      <h4>Route Options</h4>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={routeOptions.loopToStart}
              onChange={handleOptionChange('loopToStart')}
              color="primary"
            />
          }
          label="Loop to Start"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={routeOptions.avoidHighways}
              onChange={handleOptionChange('avoidHighways')}
              color="primary"
            />
          }
          label="Avoid Highways"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={routeOptions.avoidTolls}
              onChange={handleOptionChange('avoidTolls')}
              color="primary"
            />
          }
          label="Avoid Tolls"
        />
      </FormGroup>
      <FormControl fullWidth>
        <Select
          value={routeOptions.travelMode}
          onChange={handleTravelModeChange}
          displayEmpty
        >
          <MenuItem value={google.maps.TravelMode.DRIVING}>Driving</MenuItem>
          <MenuItem value={google.maps.TravelMode.BICYCLING}>Bicycling</MenuItem>
          <MenuItem value={google.maps.TravelMode.WALKING}>Walking</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default RouteOptions;
