'use client';

import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, selectCartItemById } from '@/store/slices/cartSlice';

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
      <div className="relative h-44 sm:h-48 w-full bg-gray-100">
        <Image
        loading='eager'
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-orange-600 px-2.5 py-1 rounded-full shadow-2xs">
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1 flex-1 line-clamp-2">{item.description}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-bold text-gray-900 text-base sm:text-lg">₹{item.price.toFixed(2)}</span>

          {inCart === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
            >
              <span className="text-sm font-bold">+</span>
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center border border-orange-500 rounded-xl bg-orange-50/80 text-orange-600 font-bold text-xs sm:text-sm overflow-hidden shadow-2xs">
              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="w-8 h-8 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer text-base"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-2.5 font-bold text-orange-600 min-w-[20px] text-center">{inCart}</span>
              <button
                onClick={handleAdd}
                className="w-8 h-8 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer text-base"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
