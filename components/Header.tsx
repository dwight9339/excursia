import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.scss';
import commonStyles from "../styles/common.module.scss";
import { useEffect, useState, useContext } from 'react';
import ModalContext from '../contexts/ModalContext';
import AccountSettings from './AccountSettings';
import { sign } from 'crypto';

const Header = () => {
  const { data, status } = useSession();
  const { openModal, closeModal } = useContext(ModalContext);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setMenuOpen(false);
    }
  }, [status]);

  const showAccountSettings = () => {
    setMenuOpen(false);
    openModal(
      "Account Settings",
      <AccountSettings />,
      []
    );
  };

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
                <>{data?.user?.name?.firstName?.[0]}{data?.user?.name?.lastName?.[0]}</>
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
                <div className={styles.dropDownMenuButton} onClick={() => {
                  setMenuOpen(false);
                  router.push("/")
                }}>New Itinerary</div>
                <div className={styles.dropDownMenuButton} onClick={() => {
                  setMenuOpen(false);
                  router.push("/my-itineraries")
                }}>My Itineraries</div>
                <div className={styles.dropDownMenuButton} onClick={showAccountSettings}>Account Settings</div>
                <div className={styles.dropDownMenuButton} onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}>Log Out</div>
              </>
            ) : (
              <>
                <div className={styles.dropDownMenuButton} onClick={() => {
                  setMenuOpen(false);
                  signIn();
                }}>Log In</div>
                <div className={styles.dropDownMenuButton} onClick={() => {
                  setMenuOpen(false);
                  router.push("/sign-up");
                }}>Sign Up</div>
              </>
            )}
          </div>
        )
      }
    </header>
  );
};

export default Header;
