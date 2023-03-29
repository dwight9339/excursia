declare interface Itinerary {
  id: string;
  name: string;
  locationCenter: google.maps.LatLngLiteral;
  activities: Activity[];
  createdBy: string;
}