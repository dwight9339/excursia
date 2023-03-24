declare interface Activity {
  name: string;
  allottedTime: number;  // In minutes
  place: google.maps.places.PlaceResult;
}