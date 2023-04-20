import React from 'react';
import {
  Typography,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from "next/router";
import { fetchItinerary } from '../../../lib/dbFetch';
import { generateDirectionsUrl } from '../../../lib/mapFunctions';
import { useLoadScript } from '@react-google-maps/api';
import ItineraryMap from '../../../components/ItineraryMap';
import styles from "./ItineraryPage.module.css"

interface ItineraryPageProps {
  itinerary: Itinerary;
}

const ItineraryPage: React.FC<ItineraryPageProps> = ({ itinerary }) => {
  if (!itinerary) return <div></div>;
  const { data, status } = useSession();
  const router = useRouter();
  const userData: any = { ...data?.user };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: ["places"]
  });

  if (!isLoaded) {
    return (
      <Box>
        <div className={styles.spinnerContainer}>
          <CircularProgress />
        </div>
      </Box>
    )
  }

  const itineraryLocations = itinerary.activities
    .map((activity) => activity.place?.geometry?.location || activity.location)
    .filter((location) => location) as google.maps.LatLng[];

  return (
    <Box className={styles.container}>
      <div className={styles.itineraryNameContainer}>
        <Typography variant="h4" gutterBottom>
          {itinerary.name}
        </Typography>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.mapContainer}>
          <ItineraryMap
            directions={itinerary.directions}
            activities={itinerary.activities}
            location={itinerary.startingLocation}
            zoomLevel={7}
            mapWidth={600}
            mapHeight={400}
          />
        </div>
        <div className={styles.directionsButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            href={generateDirectionsUrl(itinerary.startingLocation, itineraryLocations)}
            target="_blank"
          >
            Get directions
          </Button>
        </div>
        <div className={styles.activityListContainer}>
          <ul>
            {itinerary.activities.map((activity, index) => {
              const placeLink = `https://www.google.com/maps/place/?q=place_id:${activity.place?.place_id}`;

              return (
                <li key={index} style={{
                  listStyle: "none",
                  marginBottom: 20,
                  backgroundColor: "#f5f5f5",
                  width: "fit-content",
                  padding: "10px 20px",
                }}>
                  <a href={placeLink}>
                    <Typography variant="h6" gutterBottom>
                      {activity.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {activity.allottedTime} minutes
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {activity.place?.vicinity}
                    </Typography>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Box>
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  try {
    const params: any = context.params;
    const { id } = params;
    const res = await fetchItinerary(id);

    if (res) {
      const {_id, ...itinerary} = res;
      console.log("Itinerary retrieved");
      return { props: { itinerary }};
    } else {
      console.log(`Unable to retrieve draft`);
      return { props: { itinerary: {}}}; 
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    return { props: { itinerary: {}}};
  }
};

export default ItineraryPage;