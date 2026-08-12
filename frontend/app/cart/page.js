'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalPrice, clearCart } from '@/store/slices/cartSlice';
import CartItem from '@/components/cart/CartItem';
import EmptyState from '@/components/ui/EmptyState';

export default function CartPage() {
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Add some delicious items from the menu to get started."
        />
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="block text-left text-gray-500 hover:text-gray-700 text-sm py-6 transition-colors"
        >
          ← Back
        </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Delivery fee</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-4">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3">
        <Link
          href="/checkout"
          className="block text-center bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold py-4 rounded-xl text-lg transition-all"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
