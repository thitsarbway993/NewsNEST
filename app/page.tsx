'use client';
import NavLinks from '@/components/NavLinks';
import InstallPWA from '../components/InstallPWA';
import NewsT from './latest/page';
import CryptoNewsSection from '@/components/CryptoNewsSection';

export default function HomePage() {

  return (
    <main style={{ padding: '1rem' }}>
      <InstallPWA />
      <NavLinks/>
      {/* <NewsT/> */}
      <CryptoNewsSection/>
    </main>
  );
}

