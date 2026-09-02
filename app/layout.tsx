import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OmniContent AI — One Source to Multi-Format Content Intelligence Platform',
  description:
    'Transform any source document, report, or prompt into multiple platform-adapted content formats simultaneously with factual verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
