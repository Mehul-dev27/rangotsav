'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ShoppingBag,
    Search,
    User,
    Menu,
    X,
    ChevronDown,
    Sparkles,
    Flame
} from 'lucide-react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
            {/* Top Festive Announcement Bar */}
            <div className="bg-gradient-to-r from-amber-700 via-rose-700 to-amber-700 text-amber-50 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Navratri Festive Collection is Live! Enjoy Free Shipping Across India.</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-800 via-rose-800 to-amber-900 bg-clip-text text-transparent tracking-wider">
                                RANGOTSAV
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Menu */}
                    <div className="hidden md:flex items-center space-x-8">

                        {/* 1. NAVRATRI SPECIAL (Featured First) */}
                        <div
                            className="relative group py-6"
                            onMouseEnter={() => setActiveDropdown('navratri')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href="/categories/navratri-special"
                                className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-900 transition-colors"
                            >
                                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
                                <span>Navratri Collection</span>
                                <span className="bg-rose-100 text-rose-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full border border-rose-200">
                                    Hot
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-rose-500 group-hover:rotate-180 transition-transform duration-200" />
                            </Link>

                            {/* Navratri Dropdown Menu */}
                            {activeDropdown === 'navratri' && (
                                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-amber-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="text-xs font-semibold text-amber-800 px-3 py-1 uppercase tracking-wider">
                                        Festive Highlights
                                    </div>
                                    <Link
                                        href="/categories/chaniya-cholis"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                                    >
                                        Chaniya Cholis
                                    </Link>
                                    <Link
                                        href="/categories/navratri-bangles"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                                    >
                                        Garba Bangles & Sets
                                    </Link>
                                    <Link
                                        href="/categories/oxidized-earrings"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                                    >
                                        Oxidized Earrings
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* 2. WOMEN SECTION (Mega Menu) */}
                        <div
                            className="relative group py-6"
                            onMouseEnter={() => setActiveDropdown('women')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href="/categories/women"
                                className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-amber-800 transition-colors"
                            >
                                <span>Women</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
                            </Link>

                            {/* Women Mega Dropdown */}
                            {activeDropdown === 'women' && (
                                <div className="absolute top-full -left-12 w-[420px] bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 border-b border-amber-100 pb-1">
                                            Ethnic Wear
                                        </p>
                                        <ul className="space-y-2">
                                            <li>
                                                <Link href="/categories/regular-kurtis" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">
                                                    Regular Kurtis
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/categories/designer-kurtis" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">
                                                    Designer Kurtis
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/categories/anarkalis" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">
                                                    Anarkali Suits
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 border-b border-amber-100 pb-1">
                                            Jewellery & Accessories
                                        </p>
                                        <ul className="space-y-2">
                                            <li>
                                                <Link href="/categories/bangles" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">
                                                    Bangles
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/categories/earrings" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">
                                                    Earrings
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. MEN SECTION */}
                        <div
                            className="relative group py-6"
                            onMouseEnter={() => setActiveDropdown('men')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href="/categories/men"
                                className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-amber-800 transition-colors"
                            >
                                <span>Men</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
                            </Link>

                            {activeDropdown === 'men' && (
                                <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <Link
                                        href="/categories/kurtas"
                                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium transition-colors"
                                    >
                                        Kurtas & Kurta Sets
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Action Icons */}
                    <div className="flex items-center space-x-5">
                        <button className="text-gray-700 hover:text-amber-800 transition-colors p-1.5 rounded-full hover:bg-gray-100">
                            <Search className="w-5 h-5" />
                        </button>

                        <Link href="/account" className="text-gray-700 hover:text-amber-800 transition-colors p-1.5 rounded-full hover:bg-gray-100">
                            <User className="w-5 h-5" />
                        </Link>

                        <Link href="/cart" className="relative text-gray-700 hover:text-amber-800 transition-colors p-1.5 rounded-full hover:bg-gray-100">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 pb-6 pt-3 space-y-4">

                        {/* Navratri Mobile */}
                        <div className="px-3">
                            <div className="font-bold text-rose-700 text-sm py-2 flex items-center gap-1.5">
                                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                                Navratri Special
                            </div>
                            <div className="pl-4 space-y-2 border-l-2 border-rose-200 ml-2">
                                <Link href="/categories/chaniya-cholis" className="block text-sm text-gray-600 py-1">Chaniya Cholis</Link>
                                <Link href="/categories/navratri-bangles" className="block text-sm text-gray-600 py-1">Garba Bangles</Link>
                                <Link href="/categories/oxidized-earrings" className="block text-sm text-gray-600 py-1">Oxidized Earrings</Link>
                            </div>
                        </div>

                        {/* Women Mobile */}
                        <div className="px-3">
                            <div className="font-bold text-gray-900 text-sm py-2">Women</div>
                            <div className="pl-4 space-y-2 border-l-2 border-amber-200 ml-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Clothing</p>
                                <Link href="/categories/regular-kurtis" className="block text-sm text-gray-600 py-1">Regular Kurtis</Link>
                                <Link href="/categories/designer-kurtis" className="block text-sm text-gray-600 py-1">Designer Kurtis</Link>
                                <Link href="/categories/anarkalis" className="block text-sm text-gray-600 py-1">Anarkalis</Link>

                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Jewellery</p>
                                <Link href="/categories/bangles" className="block text-sm text-gray-600 py-1">Bangles</Link>
                                <Link href="/categories/earrings" className="block text-sm text-gray-600 py-1">Earrings</Link>
                            </div>
                        </div>

                        {/* Men Mobile */}
                        <div className="px-3">
                            <div className="font-bold text-gray-900 text-sm py-2">Men</div>
                            <div className="pl-4 space-y-2 border-l-2 border-gray-200 ml-2">
                                <Link href="/categories/kurtas" className="block text-sm text-gray-600 py-1">Kurtas & Kurta Sets</Link>
                            </div>
                        </div>

                    </div>
                )}
            </nav>
        </header>
    );
}