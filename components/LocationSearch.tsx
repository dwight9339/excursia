// components/LocationSearch.tsx
import React, {useMemo} from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useLoadScript } from "@react-google-maps/api";
import { milesToMeters } from '../lib/distanceConversions';
import styles from '../styles/LocationSearch.module.scss';

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
      <li
      className={styles.suggestion}
        key={suggestion.place_id}
        onClick={() => handleSelect(suggestion.description)}
      >
        {suggestion.description}
      </li>
    ));

  return (
    <div className={styles.container}>
      <label 
        className={styles.label} 
        htmlFor="location">
            Location
      </label> 
      <input
        className={styles.textBox}
        id="location"
        type="text"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        data-testid="location-search"
        style={{
          backgroundColor: 'white'
        }}
      />
      {status === 'OK' && (
        <div className={styles.suggestionBox}>
          <div className={styles.suggestionListContainer}>
            <ul
              className={styles.suggestionList}
            >
              {renderSuggestions()}
            </ul>
          </div>
        </div>
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
