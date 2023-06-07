import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import ActivitySearchForm from "./ActivitySearchForm";
import ModalContext from "../../contexts/ModalContext";

interface UpdateSearchProps {
  itinerary: Itinerary;
};

const UpdateSearch: React.FC<UpdateSearchProps> = ({ itinerary }) => {
  const router = useRouter();
  const { closeModal } = useContext(ModalContext);
  const [updatedItinerary, updateItinerary] = useState<Itinerary>({ ...itinerary });

  const handleSaveItinerary = async () => {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItinerary),
    };

    try {
      const response = await fetch('/api/save-itinerary', requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        console.log("Itinerary updated");
        router.reload();
      } else {
        // Handle any error messages received
        console.error('Error updating itinerary:', data.message);
      }
    } catch (error) {
      // Handle any network errors
      console.error('Error fetching itinerary:', error);
    }
  };

  return (
    <div>
      <ActivitySearchForm
        itinerary={updatedItinerary}
        updateItinerary={updateItinerary}
      />  
      <div>
        <button onClick={handleSaveItinerary}>Update</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateSearch;