import React, { ChangeEvent, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import {
  Slider,
  Typography,
  Button
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Restaurant as RestaurantIcon,
  ShoppingBasket as ShoppingIcon,
  LocalMovies as EntertainmentIcon,
  NaturePeople as NatureIcon,
  Museum as MuseumIcon,
  History as HistoricalIcon,
  Church as ReligiousIcon,
  SportsSoccer as SportsIcon,
  LocalBar as NightlifeIcon,
  DirectionsRun as OutdoorIcon,
  Explore as SightseeingIcon,
  Accessible as AccessibleIcon,
  RiceBowl as VegetarianIcon,
} from '@mui/icons-material';
import LocationSearch from './LocationSearch';
import LocationMap from './LocationMap';
import GridCheckbox from './GridCheckbox';
import * as Yup from 'yup';
import styles from "./ActivitySearchForm.module.css";
import { milesToMeters } from '../lib/distanceConversions';

interface PreferencesFormProps {
  onSubmit: (values: FormValues) => void;
}

interface FormValues {
  locationName: string;
  startingLocation: google.maps.LatLngLiteral;
  startTime: Date;
  endTime: Date;
  searchRadius: number;
  interests: string[];
  accommodations: string[];
}

const ActivitySearchForm: React.FC<PreferencesFormProps> = ({ onSubmit }) => {
  const [isDefaultLocation, setIsDefaultLocation] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(4);
  const [mapWidth, setMapWidth] = useState<number>(1000);
  const [mapHeight, setMapHeight] = useState<number>(400);
  const initialValues: FormValues = {
    locationName: "No Name",
    startingLocation: {lat:38.2659269, lng:-96.7466913} as google.maps.LatLngLiteral,
    startTime: new Date(),
    endTime: new Date(),
    searchRadius: 10,
    interests: [],
    accommodations: []
  };

  const calculateZoomLevel = (searchRadius: number) => {
    const EARTH_CIRCUMFERENCE = 40075016.686; // Earth's circumference in meters
    const searchRadiusInMeters = milesToMeters(searchRadius); // Search radius in meters
    const minDim = Math.min(mapWidth, mapHeight); // Find the minimum dimension of the map container
    const METER_PER_PIXEL = searchRadiusInMeters / (minDim / 2);

    const zoomLevel = Math.log(EARTH_CIRCUMFERENCE / (METER_PER_PIXEL * 256)) / Math.log(2);
    return Math.floor(zoomLevel) * 0.98;
  };

  const validationSchema = Yup.object({
    startingLocation: Yup.string().required('Starting location is required'),
    // startTime: Yup.date()
    //   // .required('Start time is required')
    // ,
    // endTime: Yup.date()
    //   .required('End time is required')
    //   .min(Yup.ref('startTime'), 'End time must be after start time'),
    searchRadius: Yup.number()
      .required('Must select a search radius')
      .min(1, 'Travel boundaries must be at least 1 meter')
      .max(100, 'Travel boundaries cannot exceed 100 miles'),
  });

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log("Form submit");
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        validator={() => {}}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={styles.form}>
            {/* Location */}
            <LocationSearch
              onSelectLocation={(locationName: string, location: google.maps.LatLngLiteral) => {
                console.log(`Selected location ${locationName}, ${JSON.stringify(location)}`);
                setIsDefaultLocation(false);
                setZoomLevel(calculateZoomLevel(values.searchRadius));
                setFieldValue("locationName", locationName);
                setFieldValue("startingLocation", location);
              }}
            />

            {/* Search Radius Slider */}
            <div className={styles.searchRadiusSliderContainer}>
              <Typography id="search-radius-slider" gutterBottom>
                Search Radius: {values.searchRadius} miles
              </Typography>
              <Slider
                value={values.searchRadius}
                onChange={(e, newValue) => {
                  handleChange({ target: { name: 'searchRadius', value: newValue } });
                  setZoomLevel(calculateZoomLevel(newValue as number));
                }}
                onBlur={handleBlur}
                name="searchRadius"
                min={1}
                max={60}
                step={1}
                valueLabelDisplay="auto"
                aria-labelledby="search-radius-slider"
                disabled={isDefaultLocation}
              />
            </div>

            {/* Map */}
            <div style={{ height: mapHeight, width: '100%', marginTop: '1rem' }}>
              {/* Todo: Add map component to display user's currently selected location and boundaries */}
              <LocationMap
                location={values.startingLocation}
                searchRadius={values.searchRadius}
                zoomLevel={zoomLevel}
                isDefaultLocation={isDefaultLocation}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                handleCenterChanged={(center: google.maps.LatLngLiteral) => {
                  setFieldValue("location", center);
                }}
              />
            </div>

            {/* Start and end times */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              {/* Todo: Get date/time pickers working */}
              {/* <Field
                component={DateTimePicker}
                label="Start Time"
                name="startTime"
                inputVariant="outlined"
                value={values.startTime}
                onChange={(value) => setFieldValue('startTime', value)}
              />
              <Field
                component={DateTimePicker}
                label="End Time"
                name="endTime"
                inputVariant="outlined"
                value={values.endTime}
                onChange={(value) => setFieldValue('endTime', value)}
              /> */}
            </div>

            {/* Interests */}
            <div className={styles.interestSelectContainer}>
              <Typography gutterBottom>
                Interests
              </Typography>
              <GridCheckbox
                name="interests"
                items={[
                  { id: "1", label: "Restaurants", icon: <RestaurantIcon />, value: "restaurant" },
                  { id: "2", label: "Shopping", icon: <ShoppingIcon />, value: "shopping" },
                  { id: "3", label: "Entertainment", icon: <EntertainmentIcon />, value: "entertainment" },
                  { id: "4", label: "Nature", icon: <NatureIcon />, value: "nature" },
                  { id: "5", label: "Museums", icon: <MuseumIcon />, value: "museum" },
                  { id: "6", label: "Historical", icon: <HistoricalIcon />, value: "historical" },
                  { id: "7", label: "Religious", icon: <ReligiousIcon />, value: "religious" },
                  { id: "8", label: "Sports", icon: <SportsIcon />, value: "sports" },
                  { id: "9", label: "Nightlife", icon: <NightlifeIcon />, value: "nightlife" },
                  { id: "10", label: "Outdoor", icon: <OutdoorIcon />, value: "outdoor" },
                  { id: "11", label: "Sightseeing", icon: <SightseeingIcon />, value: "sightseeing" }
                ]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setFieldValue("interests", [...values.interests, e.target.value]);
                  } else {
                    setFieldValue("interests", values.interests.filter((interest) => interest !== e.target.value));
                  }
                }}
              /> 
            </div>

            {/* Special accommodations */}
            <div className={styles.accommodationsSelectContainer}>
              <Typography gutterBottom>
                Accommodations
              </Typography>
              <GridCheckbox
                name="accommodations"
                items={[
                  { id: "1", label: "Wheelchair Accessible", icon: <AccessibleIcon />, value: "wheelchair accessible" },
                  { id: "2", label: "Vegetarian", icon: <VegetarianIcon />, value: "vegetarian" },
                ]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setFieldValue("accommodations", [...values.accommodations, e.target.value]);
                  } else {
                    setFieldValue("accommodations", values.accommodations.filter((accommodation) => accommodation !== e.target.value));
                  }
                }}
              /> 
            </div>

            {/* Create button */}
            <div className={styles.createButtonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '1rem' }}
                disabled={isDefaultLocation}
              >
                Create Itinerary
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ActivitySearchForm;