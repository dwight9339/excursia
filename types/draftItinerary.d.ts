declare interface DraftItinerary {
  name: string;
  locationCenter: google.maps.LatLngLiteral;
  startTime: string;
  selectedActivities: Activity[];
  otherOptions: google.maps.places.PlaceResult[];
}