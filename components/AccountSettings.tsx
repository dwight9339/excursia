import React, { useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import EditableText from './EditableText';
import styles from '../styles/AccountSettings.module.scss';
import axios from 'axios';
import ModalContext from '../contexts/ModalContext';

const AccountSettings: React.FC = () => {
  const { data: session, update: updateSession } = useSession();
  const { closeModal } = useContext(ModalContext);

  // If there's no session data, show a loading message
  if (!session) {
    return <div>Loading...</div>;
  }

  // Form state
  const [firstName, setFirstName] = useState(session.user?.name?.firstName || '');
  const [lastName, setLastName] = useState(session.user?.name?.lastName || '');
  const [email, setEmail] = useState(session.user?.email || '');
  const [language, setLanguage] = useState(session.user?.preferences?.language || '');
  const [distanceUnit, setDistanceUnit] = useState(session.user?.preferences?.distanceUnit || '');

  // Handlers for form changes
  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleDistanceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistanceUnit(e.target.value);
  };

  // Handler for password reset
  const handlePasswordReset = () => {
    // Add logic to handle password reset here
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/update-user', {
        userId: session.user?.id,
        userInfo: {
          name: {
            firstName,
            lastName
          },
          email,
          preferences: {
            language,
            distanceUnit
          }
        }
      });
      if (res.status === 200) {
        console.log("User info updated");
        await updateSession();
        closeModal();
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  return (
    <div className={styles.container}>
      <section>
        <h2>User Info</h2>
        <div className={styles.infoField}>
          <h3>Name</h3>
          <div className={styles.editable}>
            <EditableText
              text={firstName}
              onEdit={handleFirstNameChange}
            />
          </div>
          <div className={styles.editable}>
            <EditableText
              text={lastName}
              onEdit={handleLastNameChange}
            />
          </div>
        </div>
        <div className={styles.infoField}>
          <h3>Email</h3>
          <div className={styles.editable}>
            <EditableText
              text={email}
              onEdit={handleEmailChange}
            />
          </div>
        </div>
        {/* <button onClick={handlePasswordReset}>Reset Password</button> */}
      </section>

      <section>
        <h2>App Preferences</h2>
        <label>
          Language:
          <select value={language} onChange={handleLanguageChange}>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>
        </label>
        <label>
          Distance measurement:
          <select value={distanceUnit} onChange={handleDistanceUnitChange}>
            <option value="metric">Metric (km)</option>
            <option value="miles">Imperial (miles)</option>
          </select>
        </label>
      </section>
      <div className={styles.footer}>
        <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default AccountSettings;
