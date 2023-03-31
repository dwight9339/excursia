import React, { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { useLoadScript, GoogleMap, CircleF } from "@react-google-maps/api";
import { milesToKm, milesToMeters } from "../lib/distanceConversions";

interface MapParams {
  location: {
    lat: number;
    lng: number;
  },
  searchRadius: number,
  zoomLevel: number,
  isDefaultLocation: boolean,
  mapWidth: number,
  mapHeight: number
}

const LocationMap: React.FC<MapParams> = ({
  location,
  searchRadius,
  zoomLevel,
  isDefaultLocation,
  mapWidth,
  mapHeight
}) => {
  const libraries = useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <CircularProgress />
  }

  return (
    <div>
      <GoogleMap
        center={location}
        zoom={zoomLevel}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
      >
        {isDefaultLocation ? null : <CircleF center={location} radius={milesToMeters(searchRadius)} />}
      </GoogleMap>
    </div>
  )
}

export default LocationMap;