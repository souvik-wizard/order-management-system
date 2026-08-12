/**
 * Placeholder — ProductCard component.
 * Will be implemented in step 2.
 *
 * @param {{ product: Object }} props
 */
export default function ProductCard({ product = {} }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="bg-gray-100 h-40 rounded-md mb-3 flex items-center justify-center text-gray-400 text-sm">
        Image
      </div>
      <h3 className="font-medium text-gray-900 truncate">{product.name ?? 'Product Name'}</h3>
      <p className="text-gray-500 text-sm mt-1">{product.category ?? 'Category'}</p>
      <p className="text-gray-900 font-semibold mt-2">${product.price?.toFixed(2) ?? '0.00'}</p>
      <button className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700 transition-colors">
        Add to Cart
      </button>
    </div>
  );
}
