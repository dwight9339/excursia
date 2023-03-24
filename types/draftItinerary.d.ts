declare interface DraftItinerary {
  name: string;
  locationCenter: google.maps.LatLngLiteral;
  selectedActivities: Activity[];
  otherOptions: google.maps.places.PlaceResult[];
}