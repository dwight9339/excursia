declare interface DraftItinerary {
  name: string;
  locationCenter: google.maps.LatLngLiteral;
  selectedActivities: google.maps.Place[];
  otherOptions: google.maps.Place[];
}