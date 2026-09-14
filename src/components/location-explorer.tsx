'use client';

import {useState} from 'react';
import type {LocationCopy} from '@/content/location-copy';
import {
  buildDirectionsUrl,
  type OfficeLocation,
  type OfficeLocationId
} from '@/content/locations';
import {LocationMap} from './location-map';

interface LocationExplorerProps {
  copy: LocationCopy;
  locations: readonly OfficeLocation[];
}

export function LocationExplorer({copy, locations}: LocationExplorerProps) {
  const [selectedOfficeId, setSelectedOfficeId] = useState<OfficeLocationId>('singapore');

  return (
    <div className="location-explorer">
      <div className="office-list" aria-label={copy.heading}>
        {locations.map((location) => (
          <article
            className={`office-card${selectedOfficeId === location.id ? ' office-card--selected' : ''}`}
            key={location.id}
          >
            <button
              className="office-card__select"
              type="button"
              onClick={() => setSelectedOfficeId(location.id)}
              aria-label={copy.showOnMap[location.id]}
              aria-pressed={selectedOfficeId === location.id}
            >
              <span className="office-card__marker" aria-hidden="true" />
              <span>{copy.officeNames[location.id]}</span>
            </button>
            <address>{copy.addresses[location.addressKey]}</address>
            {location.precision === 'approximate' && (
              <p className="office-card__precision">{copy.approximate}</p>
            )}
            <a
              className="directions-link"
              href={buildDirectionsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.directions}
              <span aria-hidden="true"> ↗</span>
            </a>
          </article>
        ))}

        <p className="map-attribution">
          Map data © OpenStreetMap contributors
        </p>
      </div>

      <LocationMap
        copy={copy}
        locations={locations}
        selectedOfficeId={selectedOfficeId}
      />
    </div>
  );
}
