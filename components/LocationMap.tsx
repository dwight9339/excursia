import React, { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";

interface MapParams {
  location: {
    lat: number;
    lng: number;
  },
  searchRadius: number
}

const LocationMap: React.FC<MapParams> = ({ location, searchRadius }) => {
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
        zoom={10}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '1000px', height: '400px' }}
      />
    </div>
  )
}

export default LocationMap;