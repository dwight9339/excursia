import React from 'react';
import styles from "../../styles/EditItinerary.module.scss";
import ItineraryMap from '../ItineraryMap';
import ActivityList from '../ActivityList';
import SuggestedActivities from '../SuggestedActivities';
import AddActivity from '../AddActivity';
import EditableText from '../EditableText';

interface DesktopProps {
  itinerary: Itinerary;
  updateItinerary: (itinerary: Itinerary) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  handleSaveItinerary: () => void;
  handleAddActivity: (activity: Activity) => void;
  handleReorder: (startIndex: number, endIndex: number) => void;
  handleDeleteActivity: (index: number) => void;
  windowWidth: number;
}

const Desktop: React.FC<DesktopProps> = ({
  itinerary,
  updateItinerary,
  isSaving,
  setIsSaving,
  handleSaveItinerary,
  handleAddActivity,
  handleReorder,
  handleDeleteActivity,
  windowWidth
}) => {
  const mapWidth = windowWidth ? windowWidth * 0.35 : 400;
  const mapHeight = mapWidth * 0.85;

  return (
    <div className={styles.columnContainer}>
      <div className={styles.column}>
        <div className={styles.titleContainer}>
          <EditableText
            text={itinerary.name}
            onEdit={(newName) => updateItinerary({...itinerary, name: newName})}
          />
        </div>
        <div className={styles.mapContainer}>
          <ItineraryMap
            location={itinerary.startingLocation}
            activities={itinerary.activities}
            zoomLevel={7}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
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
      <div className={styles.column}>
        <div className={styles.selectedActivitiesContainer}>
          <h3>Selected Activities</h3>
          <ActivityList
            activities={itinerary.activities}
            onReorder={handleReorder}
            onTimeUpdate={(index, newTime) => {
              const newActivities = [...itinerary.activities];
              newActivities[index].allottedTime = newTime;
              updateItinerary({...itinerary, activities: newActivities});
            }}
            onDelete={handleDeleteActivity}
          />
        </div>
        {/* <div className={styles.optimizeButtonContainer}>
          <button onClick={optimizeOrder}>Optimize</button>
        </div> */}
      </div>
      <div className={styles.column}>
        <div className={styles.SuggestedActivitiesContainer}>
          <h3>Suggested Activities</h3>
          <SuggestedActivities
            selectedActivities={itinerary.activities.map((activity) => activity.place?.place_id).filter((placeId) => placeId) as string[]}
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
      </div>
    </div>
  );
};

export default Desktop;