'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu, selectMenuItems, selectMenuStatus, selectMenuError } from '@/store/slices/menuSlice';
import MenuItemCard from '@/components/menu/MenuItemCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function MenuPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMenuItems);
  const status = useSelector(selectMenuStatus);
  const error = useSelector(selectMenuError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMenu());
    }
  }, [status, dispatch]);

  // Group items by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          Delicious food,{' '}
          <span className="text-orange-500">delivered fast</span>
        </h1>
        <p className="text-gray-500 text-lg">Browse our menu and order in seconds.</p>
      </div>

      {/* States */}
      {status === 'loading' && <LoadingSpinner message="Loading menu…" />}
      {status === 'failed' && <ErrorMessage message={error || 'Failed to load menu. Is the backend running?'} />}

      {/* Menu grouped by category */}
      {status === 'succeeded' && (
        <div className="space-y-10">
          {Object.entries(categories).map(([category, categoryItems]) => (
            <section key={category}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full inline-block" />
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryItems.map((item) => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
