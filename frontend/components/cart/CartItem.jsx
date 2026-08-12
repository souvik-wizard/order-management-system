'use client';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart, deleteFromCart } from '@/store/slices/cartSlice';

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 py-3.5 border-b border-gray-100 last:border-0">
      {/* Image & Main Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-gray-100">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="56px"
              unoptimized
            />
          ) : (
            <span className="flex items-center justify-center h-full text-xl">🍽️</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
          <p className="text-orange-500 font-medium text-xs sm:text-sm mt-0.5">₹{item.price.toFixed(2)} / item</p>
        </div>
      </div>

      {/* Controls & Price Block */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Compact Pill Quantity Control */}
        <div className="flex items-center border border-orange-200 rounded-xl bg-orange-50/60 text-orange-600 font-bold text-xs overflow-hidden shadow-2xs">
          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="w-7 h-7 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer text-sm font-bold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-2 font-bold text-gray-900 text-xs min-w-[20px] text-center">{item.quantity}</span>
          <button
            onClick={() => dispatch(addToCart({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl }))}
            className="w-7 h-7 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer text-sm font-bold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <p className="font-bold text-gray-900 text-sm w-16 text-right">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>

        {/* Remove */}
        <button
          onClick={() => dispatch(deleteFromCart(item.id))}
          className="text-gray-300 hover:text-red-400 transition-colors text-base leading-none cursor-pointer p-1"
          aria-label="Remove item"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
