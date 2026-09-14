import type {LocationCopy} from '@/content/location-copy';
import {officeLocations} from '@/content/locations';
import {LocationExplorer} from './location-explorer';

interface LocationSectionProps {
  copy: LocationCopy;
}

export function LocationSection({copy}: LocationSectionProps) {
  return (
    <section className="locations-section" id="locations" aria-labelledby="locations-heading">
      <div className="container">
        <header className="locations-header">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="locations-heading">{copy.heading}</h2>
          <p>{copy.body}</p>
        </header>

        <LocationExplorer copy={copy} locations={officeLocations} />
      </div>
    </section>
  );
}
