'use client';
import NavLinks from '@/components/NavLinks';
import InstallPWA from '../components/InstallPWA';
import NewsT from './latest/page';
import CryptoNewsSection from '@/components/CryptoNewsSection';
import BreakingNews from '@/components/BreakingNews';
import Categories from '@/components/Categories';
import RandomNews from '@/components/RandomNews';

export default function HomePage() {

  return (
    <main style={{ padding: '1rem' }}>
      <InstallPWA />
      {/* <BreakingNews/>
      <NewsT/> */}
      <CryptoNewsSection/>
      {/* <Categories/> */}
      {/* <RandomNews/> */}
    </main>
  );
}

