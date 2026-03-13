import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Global Hotspots - World Conflict Map',
  description: 'Real-time visualization of global conflicts, wars, and hotspots around the world',
  keywords: ['conflicts', 'wars', 'world map', 'hotspots', 'geopolitics'],
  openGraph: {
    title: 'Global Hotspots - World Conflict Map',
    description: 'Real-time visualization of global conflicts and hotspots',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
