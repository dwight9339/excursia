declare interface Itinerary {
  id: string;
  name: string;
  locationCenter: google.maps.LatLngLiteral;
  startTime: string;
  activities: Activity[];
  createdBy: string;
}