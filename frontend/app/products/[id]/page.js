/**
 * Product detail page.
 * Placeholder — full implementation in step 2.
 *
 * @param {{ params: { id: string } }} props
 */
export async function generateMetadata({ params }) {
  return {
    title: `Product ${params.id} | Order Management System`,
  };
}

export default function ProductDetailPage({ params }) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Detail</h1>
      <p className="text-gray-500">Product ID: {params.id} — detail view coming in step 2.</p>
    </main>
  );
}
