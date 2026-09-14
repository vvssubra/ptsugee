import {describe, expect, it} from 'vitest';
import {buildDirectionsUrl, officeLocations} from './locations';

describe('office locations', () => {
  it('keeps exact and approximate location metadata distinct', () => {
    expect(officeLocations).toEqual([
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
    ]);
  });

  it('builds a keyless Google Maps directions URL for the destination', () => {
    expect(buildDirectionsUrl(officeLocations[1])).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=1.0447128%2C103.9326463'
    );
  });
});
