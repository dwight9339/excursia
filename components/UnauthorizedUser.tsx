import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const UnauthorizedUser: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h4" align="center" gutterBottom>
        You do not have permission to edit this itinerary.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRedirect}>
        Go Back to Home Page
      </Button>
    </Box>
  );
};

export default UnauthorizedUser;
