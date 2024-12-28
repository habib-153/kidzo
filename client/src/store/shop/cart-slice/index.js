import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const {
        productId,
        variantId,
        size,
        quantity,
        color,
        price,
        image,
        name,
      } = action.payload;
      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          productId,
          variantId,
          size,
          quantity,
          color,
          price,
          image,
          name,
        });
      }
    },
    updateCartQuantity: (state, action) => {
      const { productId, variantId, size, color, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          item.size === size &&
          item.color === color
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    deleteCartItem: (state, action) => {
      const { productId, variantId, size, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variantId === variantId &&
            item.size === size &&
            item.color === color
          )
      );
    },
    fetchCartItems: (state) => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      state.cartItems = cartItems;
    },
    saveCartItems: (state) => {
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