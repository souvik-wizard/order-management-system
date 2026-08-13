'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrderById,
  setOrderStatus,
  selectCurrentOrder,
  selectCurrentOrderStatus,
  selectOrdersStatus,
  selectOrdersError,
} from '@/store/slices/ordersSlice';
import { orderAPI } from '@/services/orderService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

const STATUS_STEPS = [
  {
    key: 'ORDER_RECEIVED',
    icon: '✅',
    label: 'Order Received',
    description: 'We got your order and are confirming it.',
  },
  {
    key: 'PREPARING',
    icon: '👨‍🍳',
    label: 'Preparing',
    description: 'Our chefs are cooking your food fresh.',
  },
  {
    key: 'OUT_FOR_DELIVERY',
    icon: '🛵',
    label: 'Out for Delivery',
    description: 'Your order is on its way!',
  },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

function StatusStepper({ currentStatus }) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 z-0" />

      <ol className="space-y-6 relative z-10">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const pending = idx > currentIdx;

          return (
            <li key={step.key} className="flex items-start gap-4">
              {/* Circle */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-all duration-500
                  ${active ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100 scale-110' : ''}
                  ${done ? 'border-green-400 bg-green-50' : ''}
                  ${pending ? 'border-gray-200 bg-white' : ''}`}
              >
                {done ? '✓' : step.icon}
              </div>

              {/* Text */}
              <div className={`pt-2 transition-opacity duration-300 ${pending ? 'opacity-40' : 'opacity-100'}`}>
                <p className={`font-semibold text-base ${active ? 'text-orange-600' : done ? 'text-green-700' : 'text-gray-400'}`}>
                  {step.label}
                  {active && (
                    <span className="ml-2 inline-flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}


export default function OrderTrackingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);
  const currentStatus = useSelector(selectCurrentOrderStatus);
  const fetchStatus = useSelector(selectOrdersStatus);
  const fetchError = useSelector(selectOrdersError);
  const eventSourceRef = useRef(null);

  // Fetch order on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  // Connect to SSE stream once we have the order
  useEffect(() => {
    if (!id || !order) return;
    if (currentStatus === 'OUT_FOR_DELIVERY') return; // already done

    // Close any previous connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = orderAPI.getStatusStreamUrl(id);
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const { status } = JSON.parse(event.data);
        dispatch(setOrderStatus(status));
      } catch (_) {
        // ignore malformed events
      }
    };

    // Listen for the explicit 'done' event sent when stream reaches final status
    es.addEventListener('done', () => {
      es.close();
    });

    // DO NOT close on error — let EventSource auto-reconnect.
    // In prod (Render cold starts, proxy hiccups), transient errors are normal.
    // The browser retries automatically using the retry interval set by the server.
    es.onerror = () => {
      // intentionally empty: allow auto-reconnect
    };

    eventSourceRef.current = es;

    return () => {
      es.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, order?._id]);

  if (fetchStatus === 'loading' && !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <LoadingSpinner message="Loading your order…" />
      </div>
    );
  }

  if (fetchStatus === 'failed' || (!order && fetchStatus === 'succeeded')) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <ErrorMessage message={fetchError || 'Order not found.'} />
        <div className="mt-6 text-center">
          <Link href="/" className="text-orange-500 hover:underline text-sm">← Back to menu</Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const displayStatus = currentStatus || order.status;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-3">
          {displayStatus === 'OUT_FOR_DELIVERY' ? '🛵' : displayStatus === 'PREPARING' ? '👨‍🍳' : '✅'}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {displayStatus === 'ORDER_RECEIVED' && 'Order Confirmed!'}
          {displayStatus === 'PREPARING' && 'Preparing your order…'}
          {displayStatus === 'OUT_FOR_DELIVERY' && 'On the way! 🎉'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Order ID: <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{order._id}</span>
        </p>
      </div>

      {/* Status stepper */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <StatusStepper currentStatus={displayStatus} />
      </div>

      {/* Order details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Order Details</h2>
        <div className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3">
          <span>Total</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
        <h2 className="font-semibold text-gray-800 mb-3">Delivery To</h2>
        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{order.customer.address}</p>
        <p className="text-sm text-gray-500">{order.customer.phone}</p>
      </div>

      <Link
        href="/"
        className="block text-center text-gray-500 hover:text-orange-500 text-sm transition-colors"
      >
        ← Order more food
      </Link>
    </div>
  );
}
