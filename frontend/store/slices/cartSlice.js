import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

/** Recalculate derived totals from the items array */
const recalculateTotals = (state) => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** Add a product to the cart, or increment its quantity if already present */
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      recalculateTotals(state);
    },

    /** Decrement quantity, or remove item if quantity reaches 0 */
    removeFromCart(state, action) {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (!existing) return;

      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter((item) => item.id !== id);
      }

      recalculateTotals(state);
    },

    /** Remove an item completely regardless of quantity */
    deleteFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      recalculateTotals(state);
    },

    /** Set the quantity of a specific item directly */
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = quantity;
      }

      recalculateTotals(state);
    },

    /** Empty the cart */
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, deleteFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) => state.cart.totalItems;
export const selectTotalPrice = (state) => state.cart.totalPrice;
export const selectCartItemById = (id) => (state) =>
  state.cart.items.find((item) => item.id === id);
/** Per-item subtotals: returns array of { id, subtotal } */
export const selectCartSubtotals = (state) =>
  state.cart.items.map((item) => ({ id: item.id, subtotal: item.price * item.quantity }));

export default cartSlice.reducer;

