import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';
import ordersReducer from './slices/ordersSlice';

/**
 * Redux store.
 *  - cart   : shopping cart (items, quantities, totals)
 *  - menu   : food menu items fetched from the backend
 *  - orders : order placement + real-time status tracking
 */
const store = configureStore({
  reducer: {
    cart: cartReducer,
    menu: menuReducer,
    orders: ordersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
