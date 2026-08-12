'use client';

import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItemById } from '@/store/slices/cartSlice';

/**
 * MenuItemCard — displays a single food item and allows adding it to the cart.
 * @param {{ item: Object }} props
 */
export default function MenuItemCard({ item }) {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItemById(item._id));
  const inCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    dispatch(addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-orange-600 px-2 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1 flex-1 line-clamp-2">{item.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg">₹{item.price.toFixed(2)}</span>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150"
          >
            <span className="text-base">+</span>
            {inCart > 0 ? `Add (${inCart})` : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
