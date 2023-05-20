import React, { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import LocationSearch from './LocationSearch';
import styles from '../styles/AddActivity.module.scss';
import commonStyles from "../styles/common.module.scss"

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
    <div className={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={styles.form}>
            <div className={styles.fieldContainer}>
              <div className={styles.fieldLabel}>
                Name
              </div>
              <input
                className={styles.textField}
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className={styles.fieldContainer}>
              <div className={styles.fieldLabel}>
                Type
              </div>
              <select
                className={styles.selectField}
                name="activityType"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="restaurant">Restaurant</option>
              </select>
            </div>
            <div className={styles.fieldContainer}>
              <div className={styles.fieldLabel}>
                Location
              </div>
              <LocationSearch
                key={resetKey}
                onSelectLocation={(locationName, location) => {
                  setFieldValue('location', location);
                }}
              />
            </div>
            <div className={styles.addActivityButton}>
              <button
                className={commonStyles.buttonPrimary}
                type="submit"
                style={{
                  fontSize: "0.9em"
                }}
              >
                Add Activity
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddActivity;
