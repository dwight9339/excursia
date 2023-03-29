declare interface Itinerary {
  name: string;
  locationCenter: google.maps.LatLngLiteral;
  activities: Activity[];
  createdBy: string;
}