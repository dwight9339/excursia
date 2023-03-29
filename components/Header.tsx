// components/Header.tsx
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useEffect } from 'react';

const Header = () => {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(`Data: ${JSON.stringify(data)}`);
  }, [data]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/excursia-logo-2.svg"
            alt="Excursia Logo"
            width={250}
            height={90}
          />
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
            <button onClick={() => router.push("/sign-up")}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
