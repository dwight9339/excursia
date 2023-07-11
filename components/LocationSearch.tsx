// components/LocationSearch.tsx
import React, { useMemo, useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useLoadScript } from "@react-google-maps/api";
import { milesToMeters } from '../lib/distanceConversions';
import styles from '../styles/ActivitySearchForm.module.scss';

interface LocationSearchProps {
  onSelectLocation: (locationName: string, location: google.maps.LatLngLiteral) => void;
  itinerary: Itinerary | undefined;
}

const SearchBar: React.FC<LocationSearchProps> = ({ onSelectLocation, itinerary }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Adjust the search area by setting location, radius, etc.
      location: new google.maps.LatLng({
        lat: itinerary?.startingLocation?.lat || 0,
        lng: itinerary?.startingLocation?.lng || 0,
      }),
      radius: itinerary?.searchRadius || milesToMeters(10),
    },
    debounce: 300,
  });

  useEffect(() => {
    if (itinerary?.startingAddress) {
      setValue(itinerary.startingAddress, false);
      clearSuggestions();
    }
  }, [itinerary?.startingAddress]);

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
    <div className={styles.locationSearchBar}>
      <label 
        className={styles.hiddenLabel} 
        htmlFor="location">
            Starting Location
      </label> 
      <input
        className={styles.textBox}
        id="location"
        type="text"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        data-testid="location-search--input"
        style={{
          backgroundColor: 'white'
        }}
      />
      {status === 'OK' && (
        <div className={styles.suggestionBox} data-testid="location-search--suggestion-box">
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

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelectLocation, itinerary }) => {
  const libraries = useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) return <div></div>;

  return <SearchBar onSelectLocation={onSelectLocation} itinerary={itinerary} />;
}

export default LocationSearch;
