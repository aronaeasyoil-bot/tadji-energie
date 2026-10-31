import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
