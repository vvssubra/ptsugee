import {locationCopy, type Locale} from '@/content/location-copy';
import {officeLocations} from '@/content/locations';
import {LocationExplorer} from './location-explorer';

interface LocationSectionProps {
  locale: Locale;
}

export function LocationSection({locale}: LocationSectionProps) {
  const copy = locationCopy[locale];

  return (
    <section className="locations-section" id="locations" aria-labelledby="locations-heading">
      <div className="locations-container">
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
