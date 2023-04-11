declare interface Activity {
  name: string;
  allottedTime: number;  // In minutes
  place?: google.maps.places.PlaceResult;
  description?: string;
  location?: google.maps.LatLng;
}