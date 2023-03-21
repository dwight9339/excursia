import React from 'react';
import PreferencesForm from '../components/PreferencesForm';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleGenerateItinerary = (preferences: any) => {
    // TODO: Call the generate-itinerary API with the user preferences
    // For now, we'll just navigate to the itinerary page
    router.push('/itinerary');
  };
  
  return (
    <div>
      <h1>Excursia</h1>
      <PreferencesForm onSubmit={handleGenerateItinerary} />
    </div>
  );
};

export default HomePage;