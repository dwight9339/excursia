import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import EditableText from './EditableText';
import styles from '../styles/AccountSettings.module.scss';

interface AccountSettingsProps {
  onSubmit: (settings: {
    firstName: string;
    lastName: string;
    email: string;
    language: string;
    distanceUnit: string;
  }) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onSubmit }) => {
  const { data: session } = useSession();

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

  const handleLanguageChange = (text: string) => {
    setLanguage(text);
  };

  const handleDistanceUnitChange = (text: string) => {
    setDistanceUnit(text);
  };

  // Handler for password reset
  const handlePasswordReset = () => {
    // Add logic to handle password reset here
  };

  const handleSubmit = () => {
    onSubmit({
      firstName,
      lastName,
      email,
      language,
      distanceUnit,
    });
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
    </div>
  );
};

export default AccountSettings;
