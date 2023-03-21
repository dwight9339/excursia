import React, { useState, useMemo } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import LocationMap from './LocationMap';
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
            {/* Todo: Add map component to display user's currently selected location and boundaries */}
            <LocationMap
              location={{lat: 38.685, lng: -101.073}}
              zoom={4}
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