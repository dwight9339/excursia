declare interface Itinerary {
  locationName: string;
  locationCenter: google.maps.LatLngLiteral;
  activities: google.maps.Place[];
}