import React, { useEffect, useMemo, useRef } from "react";
import { CircularProgress } from "@mui/material";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { getZoomLevelForBounds } from "../lib/mapFunctions";

interface MapParams {
  location: google.maps.LatLngLiteral | undefined;
  activities: Activity[];
  zoomLevel: number;
  mapWidth: number;
  mapHeight: number;
}

const ItineraryMap: React.FC<MapParams> = ({
  location,
  activities,
  zoomLevel,
  mapWidth,
  mapHeight
}) => {
  const mapRef = useRef<google.maps.Map>(null);
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });
  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleDirectionsResult = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status !== google.maps.DirectionsStatus.OK) {
      console.log(`Directions failed: ${status}`);
      return;
    } else {
      console.log(`Directions updated: ${status}`);
    }
    setDirections(result);
  };

  const getDirections = async () => {
    const startLocation = activities[0].place.geometry?.location;
    const endLocation = activities[activities.length - 1].place.geometry?.location;
    const waypoints = activities.slice(1, activities.length - 1).map((activity) => ({
      location: activity.place.geometry?.location,
      stopover: true
    }));

    if (!startLocation || !endLocation) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      handleDirectionsResult
    );
  }

  useEffect(() => {
    if (isLoaded && activities.length > 0) {
      getDirections();
    }
  }, [activities])

  if (!isLoaded) {
    return <CircularProgress />;
  }

  return (
    <div>
      <GoogleMap
        onLoad={handleLoad}
        center={location}
        zoom={directions ? getZoomLevelForBounds(directions.routes[0].bounds, mapWidth, mapHeight) : zoomLevel}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: mapWidth, height: mapHeight }}
        options={{
          disableDefaultUI: true,
          // maxZoom: zoomLevel + 1,
          // minZoom: zoomLevel - 1,
        }}
      >
        {activities.map((activity, index) => {
          if (!activity.place.geometry?.location) {
            return null;
          }
          return (
            <Marker
              key={index}
              position={activity.place.geometry.location}
              title={activity.name}
              options={{
                label: {
                  text: `${index + 1}`
                }
              }}
            />
          );
        })}
        {directions && 
          <DirectionsRenderer 
            directions={directions}
            options={{
              suppressMarkers: true
            }}
          />
        }
      </GoogleMap>
    </div>
  );
};

export default ItineraryMap;
