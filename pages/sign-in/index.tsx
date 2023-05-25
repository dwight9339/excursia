// pages/SignUp.tsx
import React from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import styles from "../../styles/authPageStyles.module.scss";

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className={styles.containerSignIn}>
      <img 
        src="/images/header_logo_dark.png"
        alt="Excursia logo"
        className={styles.logo}
      />
      <div className={styles.infoBox}>
        <div className={styles.boxTitle}>Sign In</div>
        <form method="post" action="/api/auth/callback/credentials" className={styles.form}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
};