import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, size, quantity } = action.payload;
     console.log(action.payload)
      const existingItem = state.cartItems.find(
        (item) => item.productId === productId && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ productId, size, quantity });
      }
    },
    updateCartQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productId === productId && item.size === size
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    deleteCartItem: (state, action) => {
      const { productId, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
    },
    fetchCartItems: (state) => {
      // This can be used to initialize the cart from local storage if needed
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      state.cartItems = cartItems;
    },
    saveCartItems: (state) => {
      // Save the cart items to local storage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const {
  addToCart,
  updateCartQuantity,
  deleteCartItem,
  fetchCartItems,
  saveCartItems,
} = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;