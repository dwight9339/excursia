import React, { useState, useMemo } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { TextField, Slider, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import LocationSearch from './LocationSearch';
import LocationMap from './LocationMap';
import * as Yup from 'yup';

interface PreferencesFormProps {
  onSubmit: (values: FormValues) => void;
}

interface FormValues {
  location: google.maps.LatLngLiteral;
  startTime: Date;
  endTime: Date;
  searchRadius: number;
  interests: string[];
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onSubmit }) => {

  const initialValues: FormValues = {
    location: {lat:40.2659269, lng:-96.7466913} as google.maps.LatLngLiteral,
    startTime: new Date(),
    endTime: new Date(),
    searchRadius: 5000,
    interests: [],
  };

  const validationSchema = Yup.object({
    location: Yup.string().required('Location is required'),
    startTime: Yup.date().required('Start time is required'),
    endTime: Yup.date()
      .required('End time is required')
      .min(Yup.ref('startTime'), 'End time must be after start time'),
    searchRadius: Yup.number()
      .required('Travel boundaries are required')
      .min(1, 'Travel boundaries must be at least 1 meter')
      .max(50000, 'Travel boundaries cannot exceed 50,000 meters'),
    interests: Yup.array().of(Yup.string().required('Interest is required')),
  });

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          {/* Location */}
          <LocationSearch
            onSelectLocation={(location: google.maps.LatLngLiteral) => {
              console.log(`Selected location ${JSON.stringify(location)}`);
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
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
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

          {/* Generate button */}
          <button type="submit" style={{ marginTop: '1rem' }}>
            Generate
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PreferencesForm;