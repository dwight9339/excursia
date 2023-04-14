import React, { useMemo, useRef } from "react";
import { CircularProgress } from "@mui/material";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { getZoomLevelForBounds, getBoundsFromLatLngs } from "../lib/mapFunctions";
import { get } from "https";

interface MapParams {
  directions: google.maps.DirectionsResult | undefined;
  activities: Activity[];
  location: google.maps.LatLngLiteral | undefined;
  zoomLevel: number;
  mapWidth: number;
  mapHeight: number;
}

const ItineraryMap: React.FC<MapParams> = ({
  directions,
  activities,
  location,
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
  const activityLocations: google.maps.LatLng[] = activities
    .map((activity) => {
      if (activity.place?.geometry?.location) {
        return activity.place.geometry.location;
      } else if (activity.location) {
        return new google.maps.LatLng(activity.location);
      }
    });
  const activityBounds = getBoundsFromLatLngs([...activityLocations, new google.maps.LatLng(location)]);
  const activityZoom = activityLocations ? getZoomLevelForBounds(activityBounds, mapWidth, mapHeight) : null;

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded || !location) {
    return <CircularProgress />;
  }

  return (
    <div>
      <GoogleMap
        onLoad={handleLoad}
        center={activities.length > 0 ? activityBounds.getCenter() : location}
        // zoom={directions ? getZoomLevelForBounds(directions.routes[0].bounds, mapWidth, mapHeight) : zoomLevel}
        zoom={activityZoom || zoomLevel}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: mapWidth, height: mapHeight }}
        options={{
          disableDefaultUI: true,
          // maxZoom: zoomLevel + 1,
          // minZoom: zoomLevel - 1,
        }}
      >
        {activities.map((activity, index) => {
          const position = activity.place?.geometry?.location || activity.location;

          if (!position) {
            return null;
          }

          return (
            <Marker
              key={index}
              position={position}
              title={activity.name}
              options={{
                label: {
                  text: `${index + 1}`
                }
              }}
            />
          );
        })}
        {/* {directions && 
          <DirectionsRenderer 
            directions={directions}
            options={{
              suppressMarkers: true
            }}
          />
        } */}
      </GoogleMap>
    </div>
  );
};

export default ItineraryMap;
