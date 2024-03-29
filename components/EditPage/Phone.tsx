import React, { useContext } from 'react';
import styles from "../../styles/EditItinerary.module.scss";
import ItineraryMap from '../ItineraryMap';
import ActivityList from './ActivityList';
import SuggestedActivities from './SuggestedActivities';
import AddActivity from './AddActivity';
import EditableText from '../EditableText';
import ModalContext from '../../contexts/ModalContext';
import UpdateSearch from '../ActivitySearch/UpdateSearch';

interface PhoneProps {
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

const Phone: React.FC<PhoneProps> = ({
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
  const mapWidth = windowWidth * 0.75;
  const mapHeight = mapWidth * 0.85;
  const { openModal } = useContext(ModalContext);

  return (
    <div className={styles.columnContainer}>
      <div className={styles.column}>
        <div className={styles.titleContainer} data-testid="edit-page--title-container">
          <EditableText
            text={itinerary.name}
            onEdit={(newName) => updateItinerary({...itinerary, name: newName})}
          />
        </div>
        <div className={styles.mapContainer} data-testid="edit-page--map-container">
          <ItineraryMap
            location={itinerary.startingLocation}
            activities={itinerary.activities}
            zoomLevel={7}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
          />
        </div>
        <div className={styles.selectedActivitiesContainer} data-testid="edit-page--selected-activities-container">
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
          <div className={styles.addCustomButtonContainer} data-testid="edit-page--add-custom-button-container">
            <div
              data-testid="edit-page--add-custom-button"
              className={styles.addCustomButton} 
              onClick={() => {
                openModal(
                  "Add Custom Activity",
                  <AddActivity
                    itinerary={itinerary}
                    onSubmit={handleAddActivity}
                  />,
                  []
                );
              }}
            >
              Add custom activity
            </div>
          </div>
        </div>
        <div className={styles.SuggestedActivitiesContainer} data-testid="edit-page--suggested-activities-container">
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
        <div className={styles.updateSearchContainer} data-testid="edit-page--update-search-button-container">
          <div
            data-testid="edit-page--update-search-button"
            className={styles.updateSearchButton}
            onClick={() => openModal(
              "Update Search Options",
              <UpdateSearch
                itinerary={itinerary}
              />,
              []
            )}
          >
            Update search options
          </div>
        </div>
        <div className={styles.saveButtonContainer} data-testid="edit-page--save-button-container">
          <button
            data-testid="edit-page--save-button"
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

export default Phone;