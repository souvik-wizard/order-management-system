'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu, selectMenuItems, selectMenuStatus, selectMenuError } from '@/store/slices/menuSlice';
import MenuItemCard from '@/components/menu/MenuItemCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function MenuPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMenuItems);
  const status = useSelector(selectMenuStatus);
  const error = useSelector(selectMenuError);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMenu());
    }
  }, [status, dispatch]);

  // Dynamic category list from items
  const categoriesList = ['All', ...Array.from(new Set(items.map((item) => item.category)))];

  // Filter items by category and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Group filtered items by category
  const groupedCategories = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Header & Search */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          Delicious food,{' '}
          <span className="text-orange-500">delivered fast</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Browse our menu and order your favourite meals in seconds.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto mt-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 text-lg">
            🔍
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search burgers, pizza, sides, drinks..."
            aria-label="Search menu items"
            className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        {status === 'succeeded' && categoriesList.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categoriesList.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? 'bg-orange-500 text-white shadow-sm font-semibold scale-105'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading & Error States */}
      {status === 'loading' && <LoadingSpinner message="Loading menu…" />}
      {status === 'failed' && <ErrorMessage message={error || 'Failed to load menu. Is the backend running?'} />}

      {/* Menu Content */}
      {status === 'succeeded' && (
        <>
          {filteredItems.length === 0 ? (
            <div className="text-center  max-w-md mx-auto my-8">
              <EmptyState
                icon="🔍"
                title="No menu items found"
                description={
                  searchQuery
                    ? `No items match "${searchQuery}". Try searching for something else.`
                    : `No items available in category "${selectedCategory}".`
                }
              />
              <div className="mt-4">
                <button
                  onClick={handleClearFilters}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groupedCategories).map(([category, categoryItems]) => (
                <section key={category}>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block" />
                    {category}
                    <span className="text-xs font-normal text-gray-400 ml-1">({categoryItems.length})</span>
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
        </>
      )}
    </div>
  );
}
