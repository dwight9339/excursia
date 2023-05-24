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

const Desktop: React.FC<ItineraryPageProps> = ({
  itinerary,
  screenWidth,
  moreOptions
}) => {
  const itineraryLocations = itinerary.activities
    .map((activity) => activity.place?.geometry?.location || activity.location)
    .filter((location) => location) as google.maps.LatLng[];
  const mapWidth = screenWidth * 0.45;
  const mapHeight = mapWidth * 0.75;

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <div className={styles.itineraryNameContainer}>
          <div className={styles.itineraryName}>
            {itinerary.name}
          </div>
        </div>
        <div className={styles.mapContainer}>
          <ItineraryMap
            directions={itinerary.directions}
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
      </div>
      <div className={styles.column}>
        <div className={styles.optionsButtonContainer}>
          <OptionsButton options={moreOptions} />
        </div>
        <div className={styles.activityListContainer}>
          <div className={styles.activityList}>
            {itinerary.activities && itinerary.activities.map((activity, index) => {
              const placeLink = `https://www.google.com/maps/place/?q=place_id:${activity.place?.place_id}`;

              return (
                <div key={index} className={styles.activityListItem}>
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;