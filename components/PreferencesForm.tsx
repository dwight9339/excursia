import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import { GoogleMap, Marker } from 'google-maps-react';
import * as Yup from 'yup';

interface PreferencesFormProps {
  onSubmit: (values: FormValues) => void;
}

interface FormValues {
  location: string;
  startTime: Date;
  endTime: Date;
  travelBoundaries: number;
  interests: string[];
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onSubmit }) => {
  // TODO: Implement the logic for handling location input and displaying the map marker

  const initialValues: FormValues = {
    location: '',
    startTime: new Date(),
    endTime: new Date(),
    travelBoundaries: 5000,
    interests: [],
  };

  const validationSchema = Yup.object({
    location: Yup.string().required('Location is required'),
    startTime: Yup.date().required('Start time is required'),
    endTime: Yup.date()
      .required('End time is required')
      .min(Yup.ref('startTime'), 'End time must be after start time'),
    travelBoundaries: Yup.number()
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
          <Field
            name="location"
            label="Location"
            as={TextField}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Map */}
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <GoogleMap
              // Replace with your own Google Maps API key
              google={{ apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
              initialCenter={{
                lat: 37.7749,
                lng: -122.4194,
              }}
              zoom={14}
            >
              {/* TODO: Add Marker component to display the chosen location on the map */}
            </GoogleMap>
          </div>

          {/* Start and end times */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Field
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
            />
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