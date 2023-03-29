import React, { ChangeEvent } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Slider, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import LocationSearch from './LocationSearch';
import LocationMap from './LocationMap';
import InterestCheckbox from './InterestCheckbox';
import * as Yup from 'yup';
import styles from "./ActivitySearchForm.module.css";

interface PreferencesFormProps {
  onSubmit: (values: FormValues) => void;
}

interface FormValues {
  locationName: string;
  location: google.maps.LatLngLiteral;
  startTime: Date;
  endTime: Date;
  searchRadius: number;
  interests: string[];
}

const ActivitySearchForm: React.FC<PreferencesFormProps> = ({ onSubmit }) => {

  const initialValues: FormValues = {
    locationName: "No Name",
    location: {lat:40.2659269, lng:-96.7466913} as google.maps.LatLngLiteral,
    startTime: new Date(),
    endTime: new Date(),
    searchRadius: 10,
    interests: [],
  };

  const validationSchema = Yup.object({
    location: Yup.string().required('Location is required'),
    // startTime: Yup.date()
    //   // .required('Start time is required')
    // ,
    // endTime: Yup.date()
    //   .required('End time is required')
    //   .min(Yup.ref('startTime'), 'End time must be after start time'),
    searchRadius: Yup.number()
      .required('Must select a search radius')
      .min(1, 'Travel boundaries must be at least 1 meter')
      .max(50000, 'Travel boundaries cannot exceed 50,000 meters'),
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
                setFieldValue("locationName", locationName);
                setFieldValue("location", location);
              }}
            />

            {/* Search Radius Slider */}
            <div>
              <Typography id="search-radius-slider" gutterBottom>
                Search Radius: {values.searchRadius} miles
              </Typography>
              <Slider
                value={values.searchRadius}
                onChange={(e, newValue) => handleChange({ target: { name: 'searchRadius', value: newValue } })}
                onBlur={handleBlur}
                name="searchRadius"
                min={1}
                max={60}
                step={1}
                valueLabelDisplay="auto"
                aria-labelledby="search-radius-slider"
              />
            </div>

            {/* Map */}
            <div style={{ height: '400px', width: '100%', marginTop: '1rem' }}>
              {/* Todo: Add map component to display user's currently selected location and boundaries */}
              <LocationMap
                location={values.location}
                searchRadius={values.searchRadius}
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

            {/* Other parameters */}
            {/* TODO: Add other input fields for the user to specify additional preferences */}
            <div>
              <Typography gutterBottom>
                Interests
              </Typography>
              <InterestCheckbox
                name="interests"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const { value, checked } = e.target;
                  if (checked) {
                    setFieldValue('interests', [...values.interests, value]);
                  } else {
                    setFieldValue('interests', values.interests.filter((interest) => interest !== value));
                  }
                }}
              />
            </div>

            {/* Generate button */}
            <button type="submit" style={{ marginTop: '1rem' }}>
              Generate
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ActivitySearchForm;