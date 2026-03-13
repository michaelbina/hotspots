import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WW3 Watch - World War 3 Risk Monitor',
  description: 'Real-time global conflict monitoring and World War 3 risk assessment. Track active wars, hotspots, and escalation risks worldwide.',
  keywords: ['world war 3', 'ww3', 'conflicts', 'wars', 'world map', 'nuclear war', 'geopolitics', 'risk assessment'],
  openGraph: {
    title: 'WW3 Watch - Are We on the Brink?',
    description: 'Real-time World War 3 risk index and global conflict tracker',
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
