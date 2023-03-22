declare interface SearchResults {
  locationName: string;
  locationCenter: google.maps.LatLngLiteral;
  topPicks: google.maps.Place[];
  otherOptions: google.maps.Place[];
}