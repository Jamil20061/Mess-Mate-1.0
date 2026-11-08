import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mess Manager - Hostel & Bachelor Tracker',
  description: 'Track daily meals and monthly calculation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
