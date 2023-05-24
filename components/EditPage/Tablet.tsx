import React from 'react';
import styles from "../../styles/EditItinerary.module.scss";
import ItineraryMap from '../ItineraryMap';
import ActivityList from '../ActivityList';
import SuggestedActivities from '../SuggestedActivities';
import AddActivity from '../AddActivity';
import EditableText from '../EditableText';

interface TabletProps {
  itinerary: Itinerary;
  itineraryName: string;
  setItineraryName: (newName: string) => void;
  startLocation: google.maps.LatLngLiteral | undefined;
  selectedActivities: Activity[];
  setSelectedActivities: (newActivities: Activity[]) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  handleSaveItinerary: () => void;
  handleAddActivity: (activity: Activity) => void;
  handleReorder: (startIndex: number, endIndex: number) => void;
  handleDeleteActivity: (index: number) => void;
}

const Tablet: React.FC<TabletProps> = ({
  itinerary,
  itineraryName,
  setItineraryName,
  startLocation,
  selectedActivities,
  setSelectedActivities,
  isSaving,
  setIsSaving,
  handleSaveItinerary,
  handleAddActivity,
  handleReorder,
  handleDeleteActivity
}) => {
  return (
    <div className={styles.columnContainer}>
      <div className={styles.column}>
        <div className={styles.titleContainer}>
          <EditableText
            text={itineraryName}
            onEdit={(newName) => setItineraryName(newName)}
          />
        </div>
        <div className={styles.mapContainer}>
          <ItineraryMap
            directions={undefined}
            location={startLocation}
            activities={selectedActivities}
            zoomLevel={7}
            mapWidth={375}
            mapHeight={320}
          />
        </div>
        <div className={styles.selectedActivitiesContainer}>
          <h3>Selected Activities</h3>
          <ActivityList
            activities={selectedActivities}
            onReorder={handleReorder}
            onTimeUpdate={(index, newTime) => {
              const newActivities = [...selectedActivities];
              newActivities[index].allottedTime = newTime;
              setSelectedActivities(newActivities);
            }}
            onDelete={handleDeleteActivity}
          />
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.SuggestedActivitiesContainer}>
          <h3>Suggested Activities</h3>
          <SuggestedActivities
            selectedActivities={selectedActivities.map((activity) => activity.place?.place_id).filter((placeId) => placeId) as string[]}
            suggestions={itinerary.suggestions}
            handleAddActivity={(suggestion: google.maps.places.PlaceResult) => {
              const activity: Activity = {
                name: `${suggestion.name}`,
                place: suggestion,
                allottedTime: 60
              };
              handleAddActivity(activity);
            }} 
          />
        </div>
        <div className={styles.addActivityContainer}>
          <h3>Add Activity</h3>
          <AddActivity
            onSubmit={handleAddActivity}
          />
        </div>
        <div className={styles.saveButtonContainer}>
          <button 
            className={styles.saveButton}
            disabled={isSaving}
            onClick={handleSaveItinerary}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tablet;