'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import InstallPWA from '../components/InstallPWA';
import BreakingNews from '@/components/BreakingNews';
import CatTag from '@/components/CatTag';
import Footer from '@/components/Footer';

// Dynamic imports for better code splitting
const NewsT = dynamic(() => import('./latest/page'), {
  loading: () => <p>Loading news...</p>
});

const CryptoNewsSection = dynamic(() => import('@/components/CryptoNewsSection'), {
  loading: () => <p>Loading crypto news...</p>
});

const OfflinePage = dynamic(() => import('@/components/OfflinePage'), {
  loading: () => <p>Loading offline page...</p>
});

export default function HomePage() {
  const [isOffline, setIsOffline] = useState(false); // Don't check navigator.onLine initially

  useEffect(() => {
    // Check online status after mount
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <main className="p-4">
        <InstallPWA />
        <OfflinePage />
        <Footer />
      </main>
    );
  }

  return (
    <main className="p-4">
      <InstallPWA />
      <BreakingNews />
      <NewsT />
      <CryptoNewsSection />
      <CatTag />
      <Footer />
    </main>
  );
}