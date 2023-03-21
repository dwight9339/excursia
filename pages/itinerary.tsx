import React from 'react';
import { useRouter } from 'next/router';

const ItineraryPage: React.FC = () => {
  const router = useRouter();

  // TODO: Fetch the generated itinerary from the server and display it

  return (
    <div>
      <h1>Your Itinerary</h1>
      {/* TODO: Display the itinerary information at the top of the page */}
      {/* TODO: Display the itinerary as a list of activities */}
      {/* TODO: Allow users to reorder and delete activities */}
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );
};

export default ItineraryPage;
