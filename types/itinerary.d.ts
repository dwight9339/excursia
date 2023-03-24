declare interface Itinerary {
  locationName: string;
  locationCenter: google.maps.LatLngLiteral;
  activities: Activity[];
}