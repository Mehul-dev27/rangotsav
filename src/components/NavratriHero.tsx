import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NavratriHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-rose-950 to-amber-950 text-white py-16 px-6 sm:px-12 rounded-3xl max-w-7xl mx-auto my-6 shadow-2xl border border-amber-500/20">
            <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    Exclusive Navratri Season 2026
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-amber-100 leading-tight">
                    Light Up Garba Nights in Authentic Style
                </h1>

                <p className="mt-4 text-base sm:text-lg text-amber-100/80 leading-relaxed">
                    Explore handcrafted Chaniya Cholis, vibrant traditional Bangles, and stunning Oxidized Earrings designed to make you shine this festive season.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href="/categories/chaniya-cholis"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
                    >
                        <span>Shop Chaniya Cholis</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                        href="/categories/navratri-special"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-amber-100 font-semibold px-6 py-3.5 rounded-xl border border-amber-300/30 backdrop-blur-md transition-all duration-200"
                    >
                        View Entire Collection
                    </Link>
                </div>
            </div>
        </section>
    );
}