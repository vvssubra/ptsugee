'use client';

import {useEffect, useRef, useState} from 'react';
import type {Map as LeafletMap, Marker} from 'leaflet';
import type {LocationCopy} from '@/content/location-copy';
import {buildDirectionsUrl, type OfficeLocation, type OfficeLocationId} from '@/content/locations';

interface LocationMapProps {
  copy: LocationCopy;
  locations: readonly OfficeLocation[];
  selectedOfficeId: OfficeLocationId;
}

function createPopupContent(
  location: OfficeLocation,
  copy: LocationCopy
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'map-popup';

  const title = document.createElement('strong');
  title.textContent = copy.officeNames[location.id];
  container.append(title);

  const address = document.createElement('p');
  address.textContent = copy.addresses[location.addressKey];
  container.append(address);

  if (location.precision === 'approximate') {
    const precision = document.createElement('small');
    precision.textContent = copy.approximate;
    container.append(precision);
  }

  const link = document.createElement('a');
  link.href = buildDirectionsUrl(location);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = copy.directions;
  container.append(link);

  return container;
}

export function LocationMap({copy, locations, selectedOfficeId}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<OfficeLocationId, Marker>());
  const previousSelectionRef = useRef<OfficeLocationId>(selectedOfficeId);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initialiseMap() {
      if (!containerRef.current || mapRef.current) return;

      const L = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        keyboard: true,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'pt-sugee-map-marker',
        html: '<span></span>',
        iconSize: [30, 38],
        iconAnchor: [15, 38],
        popupAnchor: [0, -34]
      });

      const bounds = L.latLngBounds([]);
      for (const location of locations) {
        const coordinates: [number, number] = [...location.coordinates];
        const marker = L.marker(coordinates, {
          icon: markerIcon,
          keyboard: true,
          title: copy.officeNames[location.id],
          alt: copy.officeNames[location.id]
        })
          .bindPopup(createPopupContent(location, copy))
          .addTo(map);
        markersRef.current.set(location.id, marker);
        bounds.extend(coordinates);
      }

      map.fitBounds(bounds, {padding: [48, 48]});
      mapRef.current = map;
      setIsReady(true);
    }

    void initialiseMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [copy, locations]);

  useEffect(() => {
    if (!isReady || previousSelectionRef.current === selectedOfficeId) return;

    const location = locations.find(({id}) => id === selectedOfficeId);
    const marker = markersRef.current.get(selectedOfficeId);
    if (!location || !marker || !mapRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapRef.current.flyTo([...location.coordinates], 13, {animate: !reduceMotion});
    marker.openPopup();
    previousSelectionRef.current = selectedOfficeId;
  }, [isReady, locations, selectedOfficeId]);

  return (
    <div className="map-frame" role="region" aria-label={copy.mapLabel}>
      {!isReady && <p className="map-loading">{copy.mapLoading}</p>}
      <div className="map-canvas" ref={containerRef} />
    </div>
  );
}
