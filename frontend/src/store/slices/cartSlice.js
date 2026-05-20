import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCartService, addToCartService, updateCartItemService,
  removeCartItemService, clearCartService,
} from '../../services/cartService';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try { return (await getCartService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải giỏ hàng' }); }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (data, { rejectWithValue }) => {
  try { return (await addToCartService(data)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi thêm vào giỏ hàng' }); }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ id, quantity }, { rejectWithValue }) => {
  try { return (await updateCartItemService(id, { quantity })).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi cập nhật giỏ hàng' }); }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (id, { rejectWithValue }) => {
  try { return (await removeCartItemService(id)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi xóa sản phẩm' }); }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try { return (await clearCartService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi xóa giỏ hàng' }); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearCartMessage(state) { state.message = null; },
    clearCartError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Add
      .addCase(addToCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Update
      .addCase(updateCartItem.pending, (state) => { state.loading = true; })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateCartItem.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Remove
      .addCase(removeCartItem.pending, (state) => { state.loading = true; })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(removeCartItem.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Clear
      .addCase(clearCart.fulfilled, (state) => { state.items = []; state.loading = false; })
      .addCase(clearCart.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
  },
});

export const { clearCartMessage, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
