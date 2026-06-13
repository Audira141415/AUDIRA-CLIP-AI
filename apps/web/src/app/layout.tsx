import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight' });

export const metadata: Metadata = {
  title: 'Audira Clip AI - Enterprise Video Repurposing',
  description: 'AI-powered video clipping and content repurposing platform.',
};

import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="bg-background text-black min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
