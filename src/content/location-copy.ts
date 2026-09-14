import type {OfficeLocationId} from './locations';

export type Locale = 'en' | 'id';

export interface LocationCopy {
  eyebrow: string;
  heading: string;
  body: string;
  mapLabel: string;
  mapLoading: string;
  directions: string;
  approximate: string;
  showOnMap: Record<OfficeLocationId, string>;
  officeNames: Record<OfficeLocationId, string>;
  addresses: {
    singaporeAddress: string;
    batamAddress: string;
  };
}

export const locationCopy: Record<Locale, LocationCopy> = {
  en: {
    eyebrow: 'Regional presence',
    heading: 'Our Locations',
    body: 'Connect with our teams supporting marine and industrial operations across Singapore and Indonesia.',
    mapLabel: 'Office map',
    mapLoading: 'Loading interactive map…',
    directions: 'Get directions',
    approximate: 'Approximate location',
    showOnMap: {
      singapore: 'Show Singapore head office on map',
      batam: 'Show Batam office on map'
    },
    officeNames: {
      singapore: 'Singapore head office',
      batam: 'Batam office'
    },
    addresses: {
      singaporeAddress: '164 Tuas South Ave 2, West Point Biz Hub, Singapore',
      batamAddress: 'K-15, Tunas Regency, Tanjung Uncang, Batam, Indonesia'
    }
  },
  id: {
    eyebrow: 'Kehadiran regional',
    heading: 'Lokasi Kami',
    body: 'Hubungi tim kami yang mendukung operasi maritim dan industri di Singapura dan Indonesia.',
    mapLabel: 'Peta kantor',
    mapLoading: 'Memuat peta interaktif…',
    directions: 'Petunjuk arah',
    approximate: 'Lokasi perkiraan',
    showOnMap: {
      singapore: 'Tampilkan kantor pusat Singapura di peta',
      batam: 'Tampilkan kantor Batam di peta'
    },
    officeNames: {
      singapore: 'Kantor pusat Singapura',
      batam: 'Kantor Batam'
    },
    addresses: {
      singaporeAddress: '164 Tuas South Ave 2, West Point Biz Hub, Singapura',
      batamAddress: 'K-15, Tunas Regency, Tanjung Uncang, Batam, Indonesia'
    }
  }
};
