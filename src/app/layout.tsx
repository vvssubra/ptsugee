import type {Metadata} from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'PT SUGEE | Engineering & Marine Solutions',
  description: 'Engineering and marine services across Indonesia and Singapore.'
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
