import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import commonStyles from '../styles/common.module.scss';

const UnauthorizedUser: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <div 
        className={commonStyles.box}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50vw',
          padding: '4rem',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          You do not have permission to edit this itinerary.
        </div>
        <div className={commonStyles.buttonPrimary} onClick={handleRedirect}>
          Home
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedUser;
