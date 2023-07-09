import React from "react";
import styles from "../../styles/ItineraryPage.module.scss";
import ItineraryMap from '../ItineraryMap';
import OptionsButton from '../OptionsButton';
import { generateDirectionsUrl } from '../../lib/mapFunctions';

interface ItineraryPageProps {
  itinerary: Itinerary;
  screenWidth: number;
  moreOptions: {
    name: string;
    onClick: () => void;
  }[];
}

const Mobile: React.FC<ItineraryPageProps> = ({
  itinerary,
  screenWidth,
  moreOptions
}) => {
  const itineraryLocations = itinerary.activities
    .map((activity) => activity.place?.geometry?.location || activity.location)
    .filter((location) => location) as google.maps.LatLng[];
  const mapWidth = screenWidth * 0.85;
  const mapHeight = mapWidth * 0.75;

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <div className={styles.singleColumnHeader}>
          <div className={styles.itineraryName}>
            {itinerary.name}
          </div>
          <OptionsButton options={moreOptions} />
        </div>
        <div className={styles.mapContainer}>
          <ItineraryMap
            activities={itinerary.activities}
            location={itinerary.startingLocation}
            zoomLevel={7}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
          />
        </div>
        <div className={styles.directionsButtonContainer}>
          <div
            className={styles.directionsButton}
            onClick={() => window.open(generateDirectionsUrl(itinerary.startingLocation, itineraryLocations), "_blank")}
          >
            Get directions
          </div>
        </div>
        <div className={styles.activityListContainer}>
          <ul className={styles.activityList}>
            {itinerary.activities && itinerary.activities.map((activity, index) => {
              const placeId = activity.place?.place_id;
              const lat = activity.place?.geometry?.location?.lat || activity.location?.lat;
              const lng = activity.place?.geometry?.location?.lng || activity.location?.lng;
              const placeLink = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}${placeId ? `&query_place_id=${placeId} ` : ""}`;

              return (
                <li key={index} className={styles.activityListItem}>
                  <div className={styles.leftSide}>
                    <a href={placeLink} target="_blank">
                      <div className={styles.activityName}>
                        {index + 1}. {activity.name}
                      </div>
                    </a>
                    <div className={styles.location}>
                      {activity.place?.vicinity || activity.description}
                    </div>
                  </div>
                  <div className={styles.rightSide}>
                    <div className={styles.allottedTime}>
                      {activity.allottedTime} minutes
                    </div> 
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mobile;