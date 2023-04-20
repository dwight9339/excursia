import React, { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField, Button } from '@mui/material';
import * as Yup from 'yup';
import LocationSearch from './LocationSearch';
import styles from './AddActivity.module.css';

interface AddActivityProps {
  onSubmit: (activity: Activity) => void;
}

interface FormValues {
  name: string;
  description: string;
  location: google.maps.LatLng | null;
}

const AddActivity: React.FC<AddActivityProps> = ({ onSubmit }) => {
  const [resetKey, setResetKey] = useState<number>(0);

  const initialValues: FormValues = {
    name: '',
    description: '',
    location: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Activity name is required'),
    description: Yup.string(),
    location: Yup.object()
      .required('Location is required'),
  });

  const handleSubmit = (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    if (!values.location) return;
    const activity: Activity = {
      name: values.name,
      allottedTime: 60,
      description: values.description,
      location: values.location,
    };
    console.log(`Submitting activity: ${JSON.stringify(activity)}`);
    onSubmit(activity);
    setSubmitting(false);
    resetForm();
    setResetKey(resetKey + 1);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <TextField
              label="Activity Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '1rem' }}
            />

            <TextField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '1rem' }}
            />

            <LocationSearch
              key={resetKey}
              onSelectLocation={(locationName, location) => {
                setFieldValue('location', location);
              }}
            />
            <div className={styles.addActivityButton}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Add Activity
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddActivity;
