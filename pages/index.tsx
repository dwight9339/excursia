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
      const response = await fetch('/api/generate-draft', requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        console.log(`Draft ID: ${data.draft_id}`);
        router.push(`/draft/${data.draft_id}`);
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
      <PreferencesForm onSubmit={handleGenerateItinerary} />
    </div>
  );
};

export default HomePage;