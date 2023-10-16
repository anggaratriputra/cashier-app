import { createSlice } from "@reduxjs/toolkit";

const orderSlices = createSlice({
  name: "order",
  initialState: {
    selectedProducts: [],
  },
  reducers: {
    addSelectedProduct: (state, action) => {
      const { id, count } = action.payload;
      const existingProduct = state.selectedProducts.find((product) => product.id === id);
      if (existingProduct) {
        // If the product already exists, use the count from the payload if it's provided
        if (count) {
          existingProduct.count += count;
        } else {
          existingProduct.count += 1;
        }
      } else {
        // If it's a new product, add it with a count of 1, or the count from the payload if provided
        state.selectedProducts.push({ ...action.payload, count: count || 1 });
      }
    },
    removeSelectedProduct: (state, action) => {
      state.selectedProducts = state.selectedProducts.filter((product) => product.id !== action.payload.id);
    },
    clearSelectedProduct: (state) => {
      state.selectedProducts = [];
    },

    incrementCount: (state, action) => {
      const { id } = action.payload;
      const product = state.selectedProducts.find((product) => product.id === id);
      if (product) {
        product.count += 1;
      }
    },
    decrementCount: (state, action) => {
      const { id } = action.payload;
      const product = state.selectedProducts.find((product) => product.id === id);
      if (product) {
        if (product.count > 1) {
          product.count -= 1;
        } else {
          // If count is 1 or less, remove the product
          state.selectedProducts = state.selectedProducts.filter((product) => product.id !== id);
        }
      }
    },
  },
});

export const { addSelectedProduct, removeSelectedProduct, incrementCount, decrementCount, clearSelectedProduct } = orderSlices.actions;

export default orderSlices.reducer;
