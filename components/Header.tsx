// components/Header.tsx
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.scss';
import commonStyles from "../styles/common.module.scss";
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';

const Header = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    console.log(`Data: ${JSON.stringify(data)}`);
  }, [data]);

  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/header_logo.png"
            alt="Excursia Logo"
            width={313}
            height={85}
          />
        </Link>
      </div>
      <div className={styles.buttonsContainer}>
        {status === "authenticated" ? (
          <>
            <div 
              className={styles.avatarContainer}
              onClick={toggleMenu}
            >
              {data?.user?.image ? (
                <Image
                  src={data.user.image}
                  alt="User Avatar"
                  width={30}
                  height={30}
                />
              ) : (
                <>{data?.user?.username?.[0]}</>
              )}
            </div>
          </>
        ) : (
          <>
            <button className={commonStyles.buttonPrimary} onClick={() => signIn()}>Log In</button>
            <button className={commonStyles.buttonPrimary} onClick={() => router.push("/sign-up")}>Sign Up</button>
          </>
        )}
      </div>
      <div className={menuOpen ? styles.hamburgerMenuActive : styles.hamburgerMenu}>
        <Image
          src="/images/hamburger.png"
          alt="Hamburger Menu"
          width={30}
          height={30}
          onClick={toggleMenu}
        />
      </div>
      {
        menuOpen && (
          <div className={styles.dropDownMenu}>
            {status === "authenticated" ? (
              <>
                <div className={styles.dropDownMenuButton} onClick={() => router.push("/")}>New Itinerary</div>
                <div className={styles.dropDownMenuButton} onClick={() => router.push("/my-itineraries")}>My Itineraries</div>
                <div className={styles.dropDownMenuButton}>Account Settings</div>
                <div className={styles.dropDownMenuButton} onClick={() => signOut()}>Log Out</div>
              </>
            ) : (
              <>
                <div className={styles.dropDownMenuButton} onClick={() => signIn()}>Log In</div>
                <div className={styles.dropDownMenuButton} onClick={() => router.push("/sign-up")}>Sign Up</div>
              </>
            )}
          </div>
        )
      }
    </header>
  );
};

export default Header;
