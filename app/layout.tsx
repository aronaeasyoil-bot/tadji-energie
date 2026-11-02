import type { Metadata } from "next";
import "./globals.css";
import {siteUrl} from "../lib/site-url";
import {shareImage} from "../lib/share-image";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  openGraph: {type:"website",siteName:"TADJI ÉNERGIE",title:"TADJI ÉNERGIE — L’énergie qui relie les marchés africains",description:"Approvisionnement et distribution de produits pétroliers en Afrique de l’Ouest.",url:siteUrl(),images:[shareImage]},
  twitter: {card:"summary_large_image",title:"TADJI ÉNERGIE",description:"Approvisionnement et distribution de produits pétroliers en Afrique de l’Ouest.",images:[shareImage]},
  title: "TADJI ÉNERGIE — L’énergie qui relie les marchés africains",
  description: "Approvisionnement maritime, transport et distribution de produits pétroliers en Afrique de l’Ouest. Sénégal, Mali, Côte d’Ivoire.",
  icons: {
    icon: "/brand/icon-official.png",
    shortcut: "/brand/icon-official.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
