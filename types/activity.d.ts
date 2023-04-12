interface BaseActivity {
  name: string;
  allottedTime: number; // In minutes
}

interface PlaceActivity extends BaseActivity {
  place: google.maps.places.PlaceResult;
  description?: never;
  location?: never;
}

interface DescriptionLocationActivity extends BaseActivity {
  place?: never;
  description: string;
  location: google.maps.LatLng;
}

declare type Activity = PlaceActivity | DescriptionLocationActivity;