import type {Metadata} from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "PT SUGEE Content Studio",
  robots: {index: false, follow: false},
};

export default function StudioLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
