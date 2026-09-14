export type OfficeLocationId = 'singapore' | 'batam';

export interface OfficeLocation {
  id: OfficeLocationId;
  coordinates: readonly [latitude: number, longitude: number];
  addressKey: 'singaporeAddress' | 'batamAddress';
  precision: 'exact' | 'approximate';
}

export const officeLocations: readonly OfficeLocation[] = [
  {
    id: 'singapore',
    coordinates: [1.3157534, 103.63431],
    addressKey: 'singaporeAddress',
    precision: 'exact'
  },
  {
    id: 'batam',
    coordinates: [1.0447128, 103.9326463],
    addressKey: 'batamAddress',
    precision: 'approximate'
  }
];

export function buildDirectionsUrl(location: OfficeLocation): string {
  const destination = location.coordinates.join(',');
  const query = new URLSearchParams({api: '1', destination});

  return `https://www.google.com/maps/dir/?${query.toString()}`;
}
