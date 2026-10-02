import React from 'react';
// 1. Import the NavratriHero component using your path alias
import NavratriHero from '@/components/NavratriHero';

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50/30">
      {/* 2. Place the hero section at the top of your homepage */}
      <NavratriHero />

      {/* Other homepage sections (Featured Products, Categories, etc.) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold font-serif text-amber-950 mb-6">
          Featured Collections
        </h2>
        {/* Your product grid or category cards go here */}
      </section>
    </main>
  );
}