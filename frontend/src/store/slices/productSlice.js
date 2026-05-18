import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeaturedService, getNewArrivalsService, getBestSellersService,
  getProductBySlugService, getRelatedProductsService,
  getProductsService, getCategoriesService,
  getProductsByCategoryService, getTopSellersService, getTopViewedService,
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

// BT05 — Thunks mới
export const fetchCategoryProducts = createAsyncThunk(
  'product/fetchCategoryProducts',
  async ({ slug, page = 1, limit = 8 }, { rejectWithValue }) => {
    try { return (await getProductsByCategoryService(slug, page, limit)).data; }
    catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải SP theo danh mục' }); }
  }
);

export const fetchTopSellers = createAsyncThunk('product/fetchTopSellers', async (_, { rejectWithValue }) => {
  try { return (await getTopSellersService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải top bán chạy' }); }
});

export const fetchTopViewed = createAsyncThunk('product/fetchTopViewed', async (_, { rejectWithValue }) => {
  try { return (await getTopViewedService()).data; }
  catch (err) { return rejectWithValue(err.response?.data || { message: 'Lỗi tải top xem nhiều' }); }
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
  // BT05
  categoryProducts: [],
  categoryInfo: null,
  categoryPagination: null,
  categoryLoading: false,
  topSellers: [],
  topViewed: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductDetail(state) { state.productDetail = null; state.relatedProducts = []; },
    clearError(state) { state.error = null; },
    clearCategoryProducts(state) { state.categoryProducts = []; state.categoryInfo = null; state.categoryPagination = null; },
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
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload.data; })
      // BT05 — Category Products (append mode for infinite scroll)
      .addCase(fetchCategoryProducts.pending, (state) => { state.categoryLoading = true; })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryInfo = action.payload.category;
        state.categoryPagination = action.payload.pagination;
        // Nếu page=1 → thay thế, page>1 → nối thêm (infinite scroll)
        if (action.payload.pagination.page === 1) {
          state.categoryProducts = action.payload.data;
        } else {
          state.categoryProducts = [...state.categoryProducts, ...action.payload.data];
        }
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => { state.categoryLoading = false; state.error = action.payload?.message; })
      // Top Sellers
      .addCase(fetchTopSellers.fulfilled, (state, action) => { state.topSellers = action.payload.data; })
      // Top Viewed
      .addCase(fetchTopViewed.fulfilled, (state, action) => { state.topViewed = action.payload.data; });
  },
});

export const { clearProductDetail, clearError, clearCategoryProducts } = productSlice.actions;
export default productSlice.reducer;
