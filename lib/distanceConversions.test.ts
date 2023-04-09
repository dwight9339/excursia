import {
  kmToMiles,
  metersToMiles,
  milesToKm,
  milesToMeters,
} from './distanceConversions';

test('kmToMiles should convert kilometers to miles correctly', () => {
  expect(kmToMiles(1)).toBeCloseTo(0.621371, 5);
  expect(kmToMiles(5)).toBeCloseTo(3.106855, 5);
});

test('metersToMiles should convert meters to miles correctly', () => {
  expect(metersToMiles(1000)).toBeCloseTo(0.621371, 5);
  expect(metersToMiles(5000)).toBeCloseTo(3.106855, 5);
});

test('milesToKm should convert miles to kilometers correctly', () => {
  expect(milesToKm(1)).toBeCloseTo(1.60934, 5);
  expect(milesToKm(5)).toBeCloseTo(8.0467, 5);
});

test('milesToMeters should convert miles to meters correctly', () => {
  expect(milesToMeters(1)).toBeCloseTo(1609.34, 5);
  expect(milesToMeters(0.5)).toBeCloseTo(804.67, 5);
});
