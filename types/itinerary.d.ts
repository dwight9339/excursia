declare interface Itinerary {
  id: string;
  name: string;
  startingLocation: google.maps.LatLngLiteral;
  startTime: string;
  interests: string[];
  searchRadius: number;
  activities: Activity[];
  createdBy?: string;
}