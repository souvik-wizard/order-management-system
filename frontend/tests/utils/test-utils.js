import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/slices/cartSlice';
import menuReducer from '@/store/slices/menuSlice';
import ordersReducer from '@/store/slices/ordersSlice';

export function renderWithRedux(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        cart: cartReducer,
        menu: menuReducer,
        orders: ordersReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
