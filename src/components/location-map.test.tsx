import {render, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import enMessages from '../../messages/en.json';
import {officeLocations} from '@/content/locations';
import {LocationMap} from './location-map';

const leaflet = vi.hoisted(() => {
  const mapInstance = {
    fitBounds: vi.fn(),
    flyTo: vi.fn(),
    remove: vi.fn()
  };
  const markers: Array<{
    bindPopup: ReturnType<typeof vi.fn>;
    addTo: ReturnType<typeof vi.fn>;
    openPopup: ReturnType<typeof vi.fn>;
  }> = [];

  return {mapInstance, markers};
});

vi.mock('leaflet', () => ({
  map: vi.fn(() => leaflet.mapInstance),
  tileLayer: vi.fn(() => ({addTo: vi.fn()})),
  divIcon: vi.fn(() => ({})),
  latLngBounds: vi.fn(() => ({extend: vi.fn()})),
  marker: vi.fn(() => {
    const marker = {
      bindPopup: vi.fn(),
      addTo: vi.fn(),
      openPopup: vi.fn()
    };
    marker.bindPopup.mockReturnValue(marker);
    marker.addTo.mockReturnValue(marker);
    leaflet.markers.push(marker);
    return marker;
  })
}));

describe('LocationMap', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({matches: false})
    });
    leaflet.mapInstance.fitBounds.mockClear();
    leaflet.mapInstance.flyTo.mockClear();
    leaflet.mapInstance.remove.mockClear();
    leaflet.markers.length = 0;
  });

  it('fits both offices initially and opens the selected marker', async () => {
    const {rerender} = render(
      <LocationMap
        copy={enMessages.locations}
        locations={officeLocations}
        selectedOfficeId="singapore"
      />
    );

    await waitFor(() => expect(leaflet.mapInstance.fitBounds).toHaveBeenCalledOnce());
    expect(leaflet.markers).toHaveLength(2);

    rerender(
      <LocationMap
        copy={enMessages.locations}
        locations={officeLocations}
        selectedOfficeId="batam"
      />
    );

    await waitFor(() => {
      expect(leaflet.mapInstance.flyTo).toHaveBeenCalledWith(
        [1.0447128, 103.9326463],
        13,
        {animate: true}
      );
    });
    expect(leaflet.markers[1].openPopup).toHaveBeenCalledOnce();
  });

  it('turns off map movement animation when reduced motion is requested', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValueOnce({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
      addListener: () => undefined,
      removeListener: () => undefined
    });

    const {rerender} = render(
      <LocationMap
        copy={enMessages.locations}
        locations={officeLocations}
        selectedOfficeId="singapore"
      />
    );
    await waitFor(() => expect(leaflet.mapInstance.fitBounds).toHaveBeenCalledOnce());

    rerender(
      <LocationMap
        copy={enMessages.locations}
        locations={officeLocations}
        selectedOfficeId="batam"
      />
    );

    await waitFor(() => {
      expect(leaflet.mapInstance.flyTo).toHaveBeenCalledWith(
        [1.0447128, 103.9326463],
        13,
        {animate: false}
      );
    });
  });
});
