import React, { useMemo, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { useLoadScript, GoogleMap, CircleF } from "@react-google-maps/api";
import { milesToMeters } from "../lib/distanceConversions";

interface MapParams {
  location: {
    lat: number;
    lng: number;
  },
  searchRadius: number,
  zoomLevel: number,
  isDefaultLocation: boolean,
  mapWidth: number,
  mapHeight: number,
  handleCenterChanged: (center: google.maps.LatLngLiteral) => void,
}

const LocationMap: React.FC<MapParams> = ({
  location,
  searchRadius,
  zoomLevel,
  isDefaultLocation,
  mapWidth,
  mapHeight,
  handleCenterChanged
}) => {
  const mapRef = useRef<google.maps.Map>(null);
  const libraries = useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) {
    return <CircularProgress />
  }

  return (
    <div>
      <GoogleMap
        onLoad={handleLoad}
        center={location}
        zoom={zoomLevel}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: mapWidth, height: mapHeight }}
        onDragEnd={() => {
          const newCenter = mapRef.current?.getCenter().toJSON() as google.maps.LatLngLiteral;
          console.log(`New center: ${newCenter?.lat}, ${newCenter?.lng}`);
          handleCenterChanged(newCenter);
        }}
        
        options={{
          disableDefaultUI: true,
          maxZoom: zoomLevel + 0.4,
          minZoom: zoomLevel - 0.4,
        }}
      >
        {isDefaultLocation ? null : <CircleF center={location} radius={milesToMeters(searchRadius)} />}
      </GoogleMap>
    </div>
  )
}

export default LocationMap;