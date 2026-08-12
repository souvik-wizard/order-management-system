'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/utils/helpers';
import { orderAPI } from '@/services/orderService';

/**
 * OrderCard — displays a single order summary in the order history page.
 * Listens to live SSE updates for active orders so the status badge updates in real time.
 * @param {{ order: Object }} props
 */
export default function OrderCard({ order }) {
  const [currentStatus, setCurrentStatus] = useState(order?.status);

  // Sync initial prop changes
  useEffect(() => {
    setCurrentStatus(order?.status);
  }, [order?.status]);

  // Connect to SSE stream if the order is not yet at final status
  useEffect(() => {
    if (!order?._id || currentStatus === 'OUT_FOR_DELIVERY') return;

    // Check if EventSource is supported in browser environment
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    const url = orderAPI.getStatusStreamUrl(order._id);
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.status) {
          setCurrentStatus(data.status);
        }
      } catch (_) {
        // ignore JSON parse errors
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [order?._id, currentStatus]);

  if (!order) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ORDER_RECEIVED':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">Received</span>;
      case 'PREPARING':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">Preparing 👨‍🍳</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">Out for Delivery 🛵</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100">
        <div>
          <span className="text-xs text-gray-400 font-mono block">Order ID</span>
          <span className="font-mono text-sm font-semibold text-gray-800">{order._id}</span>
        </div>
        <div>
          {getStatusBadge(currentStatus)}
        </div>
      </div>

      {/* Items Summary */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
        <ul className="space-y-1 text-sm text-gray-700">
          {order.items?.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
              <span className="font-medium text-gray-900">₹{item.subtotal?.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
        <div>
          <span className="text-xs text-gray-400 block">
            {order.createdAt ? formatDate(order.createdAt) : ''}
          </span>
          <span className="text-base font-bold text-gray-900">
            Total: ₹{order.totalAmount?.toFixed(2)}
          </span>
        </div>

        <Link
          href={`/order/${order._id}`}
          className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors"
        >
          Track Order →
        </Link>
      </div>
    </div>
  );
}
