import React, { ChangeEvent, useState, useRef, useEffect, use } from 'react';
import {
  Slider
} from '@mui/material';
import { useSession } from "next-auth/react";
import styles from "../../styles/ActivitySearchForm.module.scss"
import LocationSearch from '../LocationSearch';
import LocationMap from './LocationMap';
import GridCheckbox from './GridCheckbox';
import { milesToMeters, metersToMiles, metersToKm } from '../../lib/distanceConversions';

interface PreferencesFormProps {
  itinerary: Itinerary;
  updateItinerary: (itinerary: Itinerary) => void;
  isDraft?: boolean;
}

const ActivitySearchForm: React.FC<PreferencesFormProps> = ({ itinerary, updateItinerary, isDraft=false }) => {
  const { data } = useSession();
  const [isDefaultLocation, setIsDefaultLocation] = useState<boolean>(isDraft);
  const [zoomLevel, setZoomLevel] = useState<number>(4);
  const [mapWidth, setMapWidth] = useState<number>(850);
  const [mapHeight, setMapHeight] = useState<number>(400);
  const [deviceType, setDeviceType] = useState<string>("desktop"); // ["desktop", "tablet", "phone"]
  const windowWidth = useRef(window.innerWidth);

  useEffect(() => {
    setDeviceType(windowWidth.current > 952 ? "desktop" : windowWidth.current > 524 ? "tablet" : "phone")

    if (windowWidth.current > 952) {
      setMapWidth(750);
      setMapHeight(350);
    } else {
      setMapWidth(windowWidth.current * 0.75);
      setMapHeight(400 * (windowWidth.current * 0.75) / 850);
    }
  }, [windowWidth.current]);

  const calculateZoomLevel = (searchRadius: number) => {
    const EARTH_CIRCUMFERENCE = 40075016.686; // Earth's circumference in meters
    const minDim = Math.min(mapWidth, mapHeight); // Find the minimum dimension of the map container
    const METER_PER_PIXEL = searchRadius / (minDim / 2);

    const zoomLevel = Math.log(EARTH_CIRCUMFERENCE / (METER_PER_PIXEL * 256)) / Math.log(2);
    return Math.floor(zoomLevel) * 0.98;
  };

  useEffect(() => {
    if (!isDefaultLocation) {
      setZoomLevel(calculateZoomLevel(itinerary.searchRadius));
    }
  }, [isDefaultLocation, itinerary.searchRadius]);

  return (
    <div
      className={styles.container}
      data-testid="activity-search-form--container"
    >
      <form 
        className={styles.form}
        data-testid="activity-search-form--form"  
      >
        {/* Location */}
        <div 
          className={styles.locationSearchContainer}
          data-testid="activity-search-form--location-search-container"
        >
          <div className={styles.label}>
            Starting Location
          </div>
          <LocationSearch
            onSelectLocation={(locationAddress: string, location: google.maps.LatLngLiteral) => {
              setIsDefaultLocation(false);
              updateItinerary({
                ...itinerary,
                startingLocation: location,
                startingAddress: locationAddress
              });
            }}
            itinerary={isDefaultLocation ? undefined : itinerary}
          />
        </div>

        {/* Search Radius Slider */}
        <div 
          id="search-radius-slider" 
          className={styles.searchRadiusSliderContainer}
          data-testid="activity-search-form--search-radius-slider-container"
        >
          <div className={styles.label}>
            Search Radius: {data?.user?.preferences?.distanceUnit === "miles" ? `${metersToMiles(itinerary.searchRadius)} miles` : `${metersToKm(itinerary.searchRadius)} km`}
          </div>
          <Slider
            value={itinerary.searchRadius}
            onChange={(e, newValue) => {
              updateItinerary({...itinerary, searchRadius: newValue as number});
            }}
            name="searchRadius"
            min={8046}
            max={80467}
            step={1609}
            aria-labelledby="search-radius-slider"
            disabled={isDefaultLocation}
            sx={{
              color: "#0A89A6"
            }}
          />
        </div>

        {/* Map */}
        <div 
          style={{
            height: mapHeight,
            width: '100%',
            marginTop: '1rem',
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          data-testid="activity-search-form--map-container"
        >
          {/* Todo: Add map component to display user's currently selected location and boundaries */}
          <LocationMap
            location={itinerary.startingLocation}
            searchRadius={itinerary.searchRadius}
            zoomLevel={zoomLevel}
            isDefaultLocation={isDefaultLocation}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            handleCenterChanged={(center: google.maps.LatLngLiteral) => {
              updateItinerary({...itinerary, startingLocation: center});
            }}
          />
        </div>

        {/* Interests */}
        <div 
          className={styles.interestSelectContainer}
          data-testid="activity-search-form--interest-select-container"
        >
          <div
            className={styles.label}
          >
            Interests
          </div>
          <GridCheckbox
            name="interests"
            items={[
              { id: "1", label: "Restaurants", img: "/images/interest_icons/restaurant.png", value: "restaurant" },
              { id: "2", label: "Cafés", img: "/images/interest_icons/coffee-cup.png", value: "cafe" },
              { id: "3", label: "Shopping", img: "/images/interest_icons/shopping-cart.png", value: "shopping" },
              { id: "4", label: "Entertainment", img: "/images/interest_icons/ticket.png", value: "entertainment" },
              { id: "5", label: "Nature", img: "/images/interest_icons/nature.png", value: "nature" },
              { id: "6", label: "Museums", img: "/images/interest_icons/museum.png", value: "museum" },
              { id: "7", label: "Historical", img: "/images/interest_icons/coliseum.png", value: "historical" },
              { id: "8", label: "Religious", img: "/images/interest_icons/pray.png", value: "religious" },
              { id: "9", label: "Sports", img: "/images/interest_icons/balls-sports.png", value: "sports" },
              { id: "10", label: "Nightlife", img: "/images/interest_icons/drink.png", value: "nightlife" },
              { id: "11", label: "Outdoor", img: "/images/interest_icons/hiking.png", value: "outdoor" },
              { id: "12", label: "Sightseeing", img: "/images/interest_icons/tourism.png", value: "sightseeing" }
            ]}
            interestList={itinerary.interests}
            device={deviceType}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.checked) {
                updateItinerary({...itinerary, interests: [...itinerary.interests, e.target.value]});
              } else {
                updateItinerary({...itinerary, interests: itinerary.interests.filter((interest) => interest !== e.target.value)});
              }
            }}
          /> 
        </div>
      </form>
    </div>
  );
};

export default ActivitySearchForm;