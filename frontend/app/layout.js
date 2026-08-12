import { Geist } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/components/providers/ReduxProvider';
import Navbar from '@/components/layout/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata = {
  title: 'QuickBite — Food Delivery',
  description: 'Order delicious food online and track your delivery in real time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <ReduxProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
            © {new Date().getFullYear()} QuickBite. All rights reserved.
          </footer>
        </ReduxProvider>
      </body>
    </html>
  );
}
