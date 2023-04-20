export function getZoomLevelForBounds(
  bounds: google.maps.LatLngBounds,
  mapWidth: number,
  mapHeight: number
): number {
  const myBounds = new google.maps.LatLngBounds(bounds);
  const GLOBE_WIDTH = 256; // Width of a square map at zoom level 0 in pixels.
  const ZOOM_MAX = 21;

  const sw = myBounds.getSouthWest();
  const ne = myBounds.getNorthEast();

  const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;
  const lngDiff = ne.lng() - sw.lng();
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = zoom(mapHeight, GLOBE_WIDTH, latFraction);
  const lngZoom = zoom(mapWidth, GLOBE_WIDTH, lngFraction);

  const calculatedZoom = Math.min(latZoom, lngZoom, ZOOM_MAX);

  return calculatedZoom;

  function latRad(lat: number): number {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom(mapPx: number, worldPx: number, fraction: number): number {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }
}

export function getBoundsFromLatLngs(latLngs: google.maps.LatLng[]) {
  const bounds = new google.maps.LatLngBounds();

  latLngs.forEach((latLng) => {
    bounds.extend(latLng);
  });

  return bounds;
}

export function generateDirectionsUrl(startLocation: google.maps.LatLngLiteral, locations: google.maps.LatLng[]) {
  const baseUrl = 'https://www.google.com/maps/dir/';
  const origin = startLocation;

  if (locations.length === 0) {
    return `${baseUrl}${origin.lat},${origin.lng}`;
  }

  if (locations.length === 1) {
    return `${baseUrl}${origin.lat},${origin.lng}/${locations[-1].lat},${locations[-1].lng}`;
  }

  const destination = locations[locations.length - 1];
  const waypoints = locations.slice(0, -1).map((location) => `${location.lat},${location.lng}`).join('/');

  return `${baseUrl}${origin.lat},${origin.lng}/${waypoints}/${destination.lat},${destination.lng}`;
}

