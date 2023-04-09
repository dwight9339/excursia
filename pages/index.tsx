import React from 'react';
import ActivitySearchForm from '../components/ActivitySearchForm';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleCreateItinerary = async (preferences: any) => {
    const date = new Date();
    const newItinerary = {
      name: preferences.locationName,
      startingLocation: preferences.startingLocation,
      startTime: date.toUTCString(),
      interests: preferences.interests,
      searchRadius: preferences.searchRadius,
      activities: []
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItinerary),
    };

    try {
      const response = await fetch('/api/save-itinerary', requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        console.log(`Itinerary ID: ${data.itinerary_id}`);
        router.push(`/itinerary/${data.itinerary_id}/edit`);
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
      <ActivitySearchForm onSubmit={handleCreateItinerary} />
    </div>
  );
};

export default HomePage;