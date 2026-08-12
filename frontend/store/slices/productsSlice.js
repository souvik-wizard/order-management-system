import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '@/services/productService';

/**
 * Products slice — manages the product catalogue state.
 *
 * State shape:
 * {
 *   items: Product[],
 *   selectedProduct: Product | null,
 *   status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *   error: string | null,
 * }
 */

// ── Async thunks (placeholders — will be wired to real API in step 2) ──────────

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const data = await productAPI.getAll(params);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await productAPI.getById(id);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ── Slice ──────────────────────────────────────────────────────────────────────

const initialState = {
  items: [],
  selectedProduct: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct, clearError } = productsSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────────
export const selectAllProducts = (state) => state.products.items;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

export default productsSlice.reducer;
