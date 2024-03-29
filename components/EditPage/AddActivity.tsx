import React, { useState, useContext } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import LocationSearch from '../LocationSearch';
import styles from '../../styles/AddActivity.module.scss';
import commonStyles from "../../styles/common.module.scss"
import ModalContext from '../../contexts/ModalContext';

interface AddActivityProps {
  itinerary: Itinerary;
  onSubmit: (activity: Activity) => void;
}

interface FormValues {
  name: string;
  description: string;
  location: google.maps.LatLng | null;
}

const AddActivity: React.FC<AddActivityProps> = ({ itinerary, onSubmit }) => {
  const [resetKey, setResetKey] = useState<number>(0);
  const { closeModal } = useContext(ModalContext);

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
    onSubmit(activity);
    setSubmitting(false);
    resetForm();
    setResetKey(resetKey + 1);
    closeModal();
  };

  return (
    <div
      data-testid="add-activity--form-container"
      className={styles.container}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={styles.form}>
            <div
              data-testid="add-activity--name-field-container"
              className={styles.fieldContainer}
            >
              <div className={styles.fieldLabel}>
                Name
              </div>
              <input
                data-testid="add-activity--name-field"
                className={styles.textField}
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div
              data-testid="add-activity--location-field-container"
              className={styles.fieldContainer}
            >
              <div className={styles.fieldLabel}>
                Location
              </div>
              <LocationSearch
                key={resetKey}
                itinerary={itinerary}
                onSelectLocation={(locationName, location) => {
                  setFieldValue('location', location);
                }}
              />
            </div>
            <div className={styles.addActivityButton}>
              <button
                data-testid="add-activity--submit-button"
                className={commonStyles.buttonPrimary}
                type="submit"
                style={{
                  fontSize: "0.9em"
                }}
                disabled={!values.name || !values.location}
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
