'use client';
import InstallPWA from '../components/InstallPWA';
import NewsT from './latest/page';
import CryptoNewsSection from '@/components/CryptoNewsSection';
import BreakingNews from '@/components/BreakingNews';
import CatTag from '@/components/CatTag';
import Footer from '@/components/Footer';

export default function HomePage() {

  return (
    <main style={{ padding: '1rem' }}>
      <InstallPWA />
      <BreakingNews />
      <NewsT />
      <CryptoNewsSection />
      <CatTag />
      <Footer/>
    </main>
  );
}

