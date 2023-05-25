// pages/SignUp.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signIn } from 'next-auth/react';
import * as Yup from 'yup';
import styles from "../../styles/authPageStyles.module.scss";

const SignUp = () => {
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <div className={styles.containerSignUp}>
      <img 
        src="/images/header_logo.png"
        alt="Excursia logo"
        className={styles.logo}
      />
      <div className={styles.infoBox}>
        <div className={styles.boxTitle}>Sign Up</div>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("Submitting form...");
            setServerError('');
            try {
              const response = await fetch('/api/create-user', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: values.password,
                }),
              });

              if (response.ok) {
                await signIn('credentials', {
                  redirect: false,
                  email: values.email,
                  password: values.password,
                });
                router.push('/');
              } else {
                const { message } = await response.json();
                setServerError(message);
              }
            } catch (error) {
              setServerError('Error signing up. Please try again.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {() => (
            <Form className={styles.form}>
              <div className={styles.fieldContainer}>
                <label htmlFor="firstName">First Name</label>
                <Field type="text" id="firstName" name="firstName" />
                <ErrorMessage name="firstName" component="div" className="error" />
              </div>
              <div className={styles.fieldContainer}>
                <label htmlFor="lastName">Last Name</label>
                <Field type="text" id="lastName" name="lastName" />
                <ErrorMessage name="lastName" component="div" className="error" />
              </div>
              <div className={styles.fieldContainer}>
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div className={styles.fieldContainer}>
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className={styles.fieldContainer}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field type="password" id="confirmPassword" name="confirmPassword" />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>

              {serverError && <div className="error">{serverError}</div>}

              <div className={styles.submitButtonContainer}>
                <button type="submit">Sign Up</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;