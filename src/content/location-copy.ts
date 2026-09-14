import type { OfficeLocationId } from "./locations";

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
  addresses: { singaporeAddress: string; batamAddress: string };
}
