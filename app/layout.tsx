import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuantumThreat BTC',
  description: 'A curated resource hub for Bitcoin quantum resistance research',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
