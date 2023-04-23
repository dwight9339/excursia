// components/LocationSearch.tsx
import React, {useMemo} from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useLoadScript } from "@react-google-maps/api";
import { TextField, List, ListItem, ListItemText, Paper } from '@mui/material';
import { milesToMeters } from '../lib/distanceConversions';

interface LocationSearchProps {
  onSelectLocation: (locationName: string, location: google.maps.LatLngLiteral) => void;
}

const SearchBar: React.FC<LocationSearchProps> = ({ onSelectLocation }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Adjust the search area by setting location, radius, etc.
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const location = { lat, lng };
      onSelectLocation(address, location);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const renderSuggestions = () =>
    data.map((suggestion) => (
      <ListItem
        key={suggestion.place_id}
        onClick={() => handleSelect(suggestion.description)}
      >
        <ListItemText primary={suggestion.description} />
      </ListItem>
    ));

  return (
    <div>
      <TextField
        label="Location"
        value={value}
        onChange={handleInput}
        fullWidth
        disabled={!ready}
        variant="outlined"
        data-testid="location-search"
      />
      {status === 'OK' && (
        <Paper elevation={1} style={{ marginTop: '0.5rem' }}>
          <List>{renderSuggestions()}</List>
        </Paper>
      )}
    </div>
  );
};

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelectLocation }) => {
  const libraries = useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) return <div></div>;

  return <SearchBar onSelectLocation={onSelectLocation} />;
}

export default LocationSearch;
