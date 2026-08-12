import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '@/services/orderService';

/**
 * Orders slice — manages order placement and real-time status tracking.
 *
 * State: { currentOrder, currentOrderStatus, items, status, error }
 */

// ── Async thunks ───────────────────────────────────────────────────────────────

export const placeOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const response = await orderAPI.create(orderData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await orderAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await orderAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ── Slice ──────────────────────────────────────────────────────────────────────

const initialState = {
  currentOrder: null,
  currentOrderStatus: null, // updated in real-time via SSE
  items: [],
  status: 'idle',
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.currentOrderStatus = null;
    },
    /** Called by the SSE handler when a status event arrives */
    setOrderStatus(state, action) {
      state.currentOrderStatus = action.payload;
      if (state.currentOrder) {
        state.currentOrder.status = action.payload;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // placeOrder
      .addCase(placeOrder.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.currentOrderStatus = action.payload.status;
      })
      .addCase(placeOrder.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.currentOrderStatus = action.payload.status;
      })
      .addCase(fetchOrderById.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const { clearCurrentOrder, setOrderStatus, clearError } = ordersSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────────
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectCurrentOrderStatus = (state) => state.orders.currentOrderStatus;
export const selectAllOrders = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer;
