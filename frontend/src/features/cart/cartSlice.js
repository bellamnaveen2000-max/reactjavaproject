import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCartItem, getCart, removeCartItem } from "../../services/cartApi";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      return await getCart(userId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Could not load cart");
    }
  },
);

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      return await addCartItem(userId, { productId, quantity });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Could not add item to cart");
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  "cart/removeItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      await removeCartItem(userId, productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Could not remove item");
    }
  },
);

const initialState = {
  userId: 1,
  items: [],
  total: 0,
  status: "idle",
  error: null,
  actionStatus: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.productId !== action.payload);
        state.total = state.items.reduce((sum, item) => sum + item.lineTotal, 0);
        state.actionStatus = "succeeded";
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { setUserId } = cartSlice.actions;
export default cartSlice.reducer;
