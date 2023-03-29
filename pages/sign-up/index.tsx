// pages/SignUp.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signIn } from 'next-auth/react';
import * as Yup from 'yup';

const SignUp = () => {
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <Formik
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError('');
          try {
            const response = await fetch('/api/create-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: values.username,
                password: values.password,
              }),
            });

            if (response.ok) {
              await signIn('credentials', {
                redirect: false,
                username: values.username,
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
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field type="password" id="confirmPassword" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            {serverError && <div className="error">{serverError}</div>}

            <button type="submit">Sign Up</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;