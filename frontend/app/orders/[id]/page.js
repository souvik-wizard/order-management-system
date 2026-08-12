/**
 * Order detail page.
 * Placeholder — full implementation in step 2.
 */
export async function generateMetadata({ params }) {
  return {
    title: `Order ${params.id} | Order Management System`,
  };
}

export default function OrderDetailPage({ params }) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Detail</h1>
      <p className="text-gray-500">Order ID: {params.id} — detail view coming in step 2.</p>
    </main>
  );
}
