// pages/SignUp.tsx
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import styles from "../../styles/authPageStyles.module.scss";
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showError, setShowError] = React.useState<boolean>(false);
  const [signingIn, setSigningIn] = React.useState<boolean>(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSigningIn(true);
      const target = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
      };
      const email = target.email.value;
      const password = target.password.value;
      const res = await signIn('credentials', { email, password, redirect: false});
      console.log(JSON.stringify(res));
      if (res?.ok) {
        console.log("Sign in successful");
        router.push("/");
      } else {
        setShowError(true);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setShowError(true);
    } finally {
      setSigningIn(false);
    }
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
        {showError && <div className={styles.errorMsg}>Unable to sign in</div>}
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
            <button disabled={signingIn} type="submit">{signingIn ? "Signing In..." : "Sign In"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};