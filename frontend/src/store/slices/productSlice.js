import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeaturedService, getNewArrivalsService, getBestSellersService,
  getProductBySlugService, getRelatedProductsService,
  getProductsService, getCategoriesService,
} from '../../services/productService';

export const fetchFeatured = createAsyncThunk('product/fetchFeatured', async (_, { rejectWithValue }) => {
  try { return (await getFeaturedService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải SP nổi bật' }); }
});

export const fetchNewArrivals = createAsyncThunk('product/fetchNewArrivals', async (_, { rejectWithValue }) => {
  try { return (await getNewArrivalsService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải SP mới' }); }
});

export const fetchBestSellers = createAsyncThunk('product/fetchBestSellers', async (_, { rejectWithValue }) => {
  try { return (await getBestSellersService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải SP bán chạy' }); }
});

export const fetchProductDetail = createAsyncThunk('product/fetchDetail', async (slug, { rejectWithValue }) => {
  try { return (await getProductBySlugService(slug)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Không tìm thấy sản phẩm' }); }
});

export const fetchRelatedProducts = createAsyncThunk('product/fetchRelated', async (id, { rejectWithValue }) => {
  try { return (await getRelatedProductsService(id)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải SP tương tự' }); }
});

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (params, { rejectWithValue }) => {
  try { return (await getProductsService(params)).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh sách SP' }); }
});

export const fetchCategories = createAsyncThunk('product/fetchCategories', async (_, { rejectWithValue }) => {
  try { return (await getCategoriesService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh mục' }); }
});

const initialState = {
  products: [],
  featuredProducts: [],
  newArrivals: [],
  bestSellers: [],
  productDetail: null,
  relatedProducts: [],
  categories: [],
  pagination: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductDetail(state) { state.productDetail = null; state.relatedProducts = []; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Featured
      .addCase(fetchFeatured.pending, (state) => { state.loading = true; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.loading = false; state.featuredProducts = action.payload.data; })
      .addCase(fetchFeatured.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // New Arrivals
      .addCase(fetchNewArrivals.pending, (state) => { state.loading = true; })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => { state.loading = false; state.newArrivals = action.payload.data; })
      .addCase(fetchNewArrivals.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Best Sellers
      .addCase(fetchBestSellers.pending, (state) => { state.loading = true; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.loading = false; state.bestSellers = action.payload.data; })
      .addCase(fetchBestSellers.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Product Detail
      .addCase(fetchProductDetail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductDetail.fulfilled, (state, action) => { state.loading = false; state.productDetail = action.payload.data; })
      .addCase(fetchProductDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Related
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => { state.relatedProducts = action.payload.data; })
      // Products (search/filter)
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload.data; state.pagination = action.payload.pagination; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload.data; });
  },
});

export const { clearProductDetail, clearError } = productSlice.actions;
export default productSlice.reducer;
