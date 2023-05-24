import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import {
  Slider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import styles from "../styles/ActivitySearchForm.module.scss"
import commonStyles from "../styles/common.module.scss";
import LocationSearch from './LocationSearch';
import LocationMap from './LocationMap';
import GridCheckbox from './GridCheckbox';
import * as Yup from 'yup';
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
  const [mapWidth, setMapWidth] = useState<number>(850);
  const [mapHeight, setMapHeight] = useState<number>(400);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const windowWidth = useRef(window.innerWidth);

  useEffect(() => {
    if (windowWidth.current > 952) {
      setMapWidth(850);
      setMapHeight(400);
    } else {
      setMapWidth(windowWidth.current * 0.89);
      setMapHeight(400 * (windowWidth.current * 0.89) / 850);
    }
  }, [windowWidth.current]);

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

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log("Form submit");
    setSubmitted(true);

    try {
      onSubmit(values);
    } catch(err) {
      console.error(`Error submitting form: ${err}`);
      setSubmitted(false);
    } 
  };

  return (
    <div
      className={styles.container}
      data-testid="activity-search-form"
    >
      <div className={styles.header}>
        Where would you like to explore?
      </div>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        validator={() => {}}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={styles.form}>
            {/* Location */}
            <div className={styles.locationSearchContainer}>
              <div className={styles.label}>
                Starting Location
              </div>
              <LocationSearch
                onSelectLocation={(locationName: string, location: google.maps.LatLngLiteral) => {
                  console.log(`Selected location ${locationName}, ${JSON.stringify(location)}`);
                  setIsDefaultLocation(false);
                  setZoomLevel(calculateZoomLevel(values.searchRadius));
                  setFieldValue("locationName", locationName);
                  setFieldValue("startingLocation", location);
                }}
              />
            </div>

            {/* Search Radius Slider */}
            <div id="search-radius-slider" className={styles.searchRadiusSliderContainer}>
              <div className={styles.label}>
                Search Radius: {values.searchRadius} miles
              </div>
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
                sx={{
                  color: "#0A89A6"
                }}
              />
            </div>

            {/* Map */}
            <div style={{
              height: mapHeight,
              width: '100%',
              marginTop: '1rem',
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
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
                interestList={values.interests}
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
            {/* <div className={styles.accommodationsSelectContainer}>
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
            </div> */}

            {/* Create button */}
            <div className={styles.createButtonContainer}>
              <button
                className={commonStyles.buttonPrimary}
                type="submit"
                style={{ marginTop: '1rem' }}
                disabled={isDefaultLocation || submitted}
              >
                Create Itinerary
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ActivitySearchForm;