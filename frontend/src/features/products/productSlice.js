import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProduct, getProducts } from "../../services/productApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (query, { rejectWithValue }) => {
    try {
      return await getProducts(query);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Could not load products");
    }
  },
);

export const saveProduct = createAsyncThunk(
  "products/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      return await createProduct(product);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Could not create product");
    }
  },
);

const initialState = {
  items: [],
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    clearCreateStatus(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.content;
        state.page = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(saveProduct.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.unshift(action.payload);
        state.totalElements += 1;
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? action.error.message;
      });
  },
});

export const { setPage, clearCreateStatus } = productSlice.actions;
export default productSlice.reducer;
