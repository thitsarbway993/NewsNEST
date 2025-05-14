'use client';
import InstallPWA from '../components/InstallPWA';
import NewsT from './latest/page';
import CryptoNewsSection from '@/components/CryptoNewsSection';
import BreakingNews from '@/components/BreakingNews';
import CatTag from '@/components/CatTag';
import Navbar from '@/components/Navbar';

export default function HomePage() {

  return (
    <main style={{ padding: '1rem' }}>
      <InstallPWA />
      <Navbar/>
      <BreakingNews />
      <NewsT />
      <CryptoNewsSection />
      <CatTag />
      {/* <Categories/> */}
      {/* <RandomNews/> */}
    </main>
  );
}

