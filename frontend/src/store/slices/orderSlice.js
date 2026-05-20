import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOrderService, getMyOrdersService, getOrderDetailService,
  cancelOrderService, requestCancelOrderService,
} from '../../services/orderService';

export const createOrder = createAsyncThunk('order/createOrder', async (data, { rejectWithValue }) => {
  try { return (await createOrderService(data)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi đặt hàng' }); }
});

export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (params, { rejectWithValue }) => {
  try { return (await getMyOrdersService(params)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải đơn hàng' }); }
});

export const fetchOrderDetail = createAsyncThunk('order/fetchOrderDetail', async (id, { rejectWithValue }) => {
  try { return (await getOrderDetailService(id)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải chi tiết đơn hàng' }); }
});

export const cancelOrder = createAsyncThunk('order/cancelOrder', async ({ id, reason }, { rejectWithValue }) => {
  try { return (await cancelOrderService(id, { reason })).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi hủy đơn hàng' }); }
});

export const requestCancelOrder = createAsyncThunk('order/requestCancelOrder', async ({ id, reason }, { rejectWithValue }) => {
  try { return (await requestCancelOrderService(id, { reason })).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi gửi yêu cầu hủy' }); }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    orderDetail: null,
    loading: false,
    error: null,
    message: null,
    pagination: null,
    createSuccess: false,
    createdOrder: null,
  },
  reducers: {
    clearOrderMessage(state) { state.message = null; },
    clearOrderError(state) { state.error = null; },
    clearOrderDetail(state) { state.orderDetail = null; },
    resetCreateSuccess(state) { state.createSuccess = false; state.createdOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; state.createSuccess = false; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.createdOrder = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Fetch list
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Detail
      .addCase(fetchOrderDetail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => { state.loading = false; state.orderDetail = action.payload.data; })
      .addCase(fetchOrderDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Cancel
      .addCase(cancelOrder.pending, (state) => { state.loading = true; })
      .addCase(cancelOrder.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(cancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Request Cancel
      .addCase(requestCancelOrder.pending, (state) => { state.loading = true; })
      .addCase(requestCancelOrder.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(requestCancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
  },
});

export const { clearOrderMessage, clearOrderError, clearOrderDetail, resetCreateSuccess } = orderSlice.actions;
export default orderSlice.reducer;
