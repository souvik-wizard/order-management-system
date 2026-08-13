'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalPrice, clearCart } from '@/store/slices/cartSlice';
import { placeOrder, selectOrdersStatus, selectOrdersError } from '@/store/slices/ordersSlice';
import EmptyState from '@/components/ui/EmptyState';

const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const orderStatus = useSelector(selectOrdersStatus);
  const orderError = useSelector(selectOrdersError);

  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [errors, setErrors] = useState({});
  // Prevent the empty-cart guard from flashing during submit → navigation
  const isSubmittingRef = useRef(false);

  if (cartItems.length === 0 && !isSubmittingRef.current) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Add items from the menu before checking out."
        />
        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!PHONE_REGEX.test(form.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const orderPayload = {
      customer: {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
      },
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
    };

    const result = await dispatch(placeOrder(orderPayload));

    if (placeOrder.fulfilled.match(result)) {
      // Set flag BEFORE clearing cart so the empty-cart guard is skipped
      // during the React re-render that happens before navigation completes.
      isSubmittingRef.current = true;
      dispatch(clearCart());
      router.push(`/order/${result.payload._id}`);
    }
  };

  const isLoading = orderStatus === 'loading';

  // Render
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-7">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Customer Details */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Delivery Details</h2>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-shadow ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main Street, City, State 10001"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-shadow resize-none ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-shadow ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 mb-1">
            <span>Delivery</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base mt-1">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </section>

        {/* API Error */}
        {orderStatus === 'failed' && orderError && (
          <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-xl p-3">
            {orderError}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 active:scale-[0.98] text-white font-semibold py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Placing Order…
            </>
          ) : (
            'Place Order 🚀'
          )}
        </button>
      </form>
    </div>
  );
}
