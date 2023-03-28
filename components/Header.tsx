// components/Header.tsx
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  const { status } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          Excursia
        </Link>
      </div>
      <div className={styles.authButtons}>
        {status === "authenticated" ? (
          <>
            <button onClick={() => signOut()}>Log Out</button>
          </>
        ) : (
          <>
            <button onClick={() => signIn()}>Log In</button>
            <button onClick={() => signIn()}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
