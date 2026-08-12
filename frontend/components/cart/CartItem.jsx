'use client';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart, deleteFromCart } from '@/store/slices/cartSlice';

/**
 * CartItem — a single row in the cart page.
 * @param {{ item: Object }} props
 */
export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
          />
        ) : (
          <span className="flex items-center justify-center h-full text-2xl">🍽️</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
        <p className="text-orange-500 font-medium text-sm mt-0.5">${item.price.toFixed(2)} each</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold hover:border-orange-400 hover:text-orange-500 transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
        <button
          onClick={() => dispatch(addToCart({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl }))}
          className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold hover:border-orange-400 hover:text-orange-500 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <p className="font-bold text-gray-900 text-sm w-16 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </p>

      {/* Remove */}
      <button
        onClick={() => dispatch(deleteFromCart(item.id))}
        className="ml-1 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
