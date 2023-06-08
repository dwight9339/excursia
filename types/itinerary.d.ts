declare interface Itinerary {
  id?: string;
  name: string;
  startingLocation: google.maps.LatLngLiteral;
  startingAddress: string;
  interests: string[];
  searchRadius: number;     // In meters
  activities: Activity[];
  suggestions: google.maps.places.PlaceResult[];
  createdDate: string;
  ownerId: string;
}