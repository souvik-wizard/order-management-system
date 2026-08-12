import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuAPI } from '@/services/menuService';

export const fetchMenu = createAsyncThunk('menu/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await menuAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearMenuError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearMenuError } = menuSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────────
export const selectMenuItems = (state) => state.menu.items;
export const selectMenuStatus = (state) => state.menu.status;
export const selectMenuError = (state) => state.menu.error;

export default menuSlice.reducer;
