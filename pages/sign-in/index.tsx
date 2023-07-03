// pages/SignUp.tsx
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import styles from "../../styles/authPageStyles.module.scss";
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    signIn('credentials', { email, password });
  };

  if (status === 'loading') {
    return (
      <div className={styles.containerSignIn}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.containerSignIn}>
      <img 
        src="/images/header_logo_dark.png"
        alt="Excursia logo"
        className={styles.logo}
      />
      <div className={styles.infoBox}>
        <div className={styles.boxTitle}>Sign In</div>
        <form onSubmit={handleSignIn} className={styles.form}>
          <div className={styles.fieldContainer}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>

          <div className={styles.fieldContainer}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className={styles.submitButtonContainer}>
            <button type="submit">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};