import React from 'react';
import PreferencesForm from '../components/PreferencesForm';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleGenerateItinerary = async (preferences: any) => {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    };

    try {
      const response = await fetch('/api/generate-itinerary', requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        // Handle the received itinerary data
        console.log(data);
      } else {
        // Handle any error messages received
        console.error('Error generating itinerary:', data.message);
      }
    } catch (error) {
      // Handle any network errors
      console.error('Error fetching itinerary:', error);
    }
  };
  
  return (
    <div>
      <h1>Excursia</h1>
      <PreferencesForm onSubmit={handleGenerateItinerary} />
    </div>
  );
};

export default HomePage;