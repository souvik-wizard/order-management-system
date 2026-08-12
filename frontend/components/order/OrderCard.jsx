/**
 * Placeholder — OrderCard component.
 * Will be implemented in step 2.
 *
 * @param {{ order: Object }} props
 */
export default function OrderCard({ order = {} }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">{order.orderNumber ?? 'ORD-00000'}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
          {order.status ?? 'pending'}
        </span>
      </div>
      <p className="text-sm text-gray-500">{order.customerName ?? 'Customer'}</p>
      <p className="text-sm text-gray-900 font-medium mt-1">${order.totalPrice?.toFixed(2) ?? '0.00'}</p>
    </div>
  );
}
