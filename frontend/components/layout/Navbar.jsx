'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectTotalItems } from '@/store/slices/cartSlice';

export default function Navbar() {
  const totalItems = useSelector(selectTotalItems);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center font-bold text-lg text-orange-500">
          🍔 QuickBite
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/orders"
            className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            <span className="text-lg">🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 right-8 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
