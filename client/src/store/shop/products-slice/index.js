/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  topSellingProducts: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );

    return result?.data;
  }
);

export const fetchTopSellingProducts = createAsyncThunk(
  "/products/fetchTopSellingProducts",
  async ({ filterParams, sortParams }) => {

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      limit: 20,
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/top-selling?${query}`
    );
console.log(result)
    return result?.data;
  }
);

export const manageProduct = createAsyncThunk(
  "/products/manageProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const url = id 
        ? `http://localhost:5000/api/admin/products/edit/${id}`
        : "http://localhost:5000/api/admin/products/add";
      
      const method = id ? "put" : "post";

      const result = await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return result.data;
    } catch (error) {
      console.error(
        "Product Management Error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to manage product");
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchTopSellingProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topSellingProducts = action.payload.data;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.topSellingProducts = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
