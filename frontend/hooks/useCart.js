import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  deleteFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  selectCartItemById,
} from '@/store/slices/cartSlice';

/**
 * useCart — convenience hook for cart operations.
 *
 * @returns cart state + action dispatchers
 */
const useCart = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: (product) => dispatch(addToCart(product)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    deleteFromCart: (id) => dispatch(deleteFromCart(id)),
    updateQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
    getItemById: (id) => useSelector(selectCartItemById(id)), // use inside component
  };
};

export default useCart;
